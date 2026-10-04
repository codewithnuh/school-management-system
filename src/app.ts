import { createServer, type Server } from 'node:http'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { createRouteHandler } from 'uploadthing/express'
import { createHealth } from '@/blocks/health-check/core/create-health.js'
import { registerExpressHealthRoute } from '@/blocks/health-check/adapters/express.js'
import {
    createExpressShutdownTask,
    createShutdownMiddleware,
} from '@/blocks/graceful-shutdown/adapters/express.js'
import { GracefulShutdown } from '@/blocks/graceful-shutdown/core/shutdown.js'
import { NodeConnectionTracker } from '@/blocks/graceful-shutdown/core/connection-tracker.js'
import { PRIORITY } from '@/blocks/graceful-shutdown/constants.js'
import type { ShutdownReason } from '@/blocks/graceful-shutdown/types.js'
import { env } from '@/config/env.js'
import sequelize from '@/infrastructure/persistence/sequelize/client.js'
import '@/models/index.js'
import swaggerSpec from '@/config/swagger.js'
import { uploadRouter } from '@/config/uploadthing.js'
import {
    handleInvalidJSON,
    handleValidationErrors,
    errorHandler,
} from '@/middleware/error.middleware.js'
import { requestLogger } from '@/middleware/loggin.middleware.js'
import { generalLimiter } from '@/middleware/rateLimit.middleware.js'
import { protectCookieAuthenticatedRequests } from '@/middleware/csrf.middleware.js'
import adminRoutes from '@/routes/Admin.js'
import authRoutes from '@/routes/AuthRoutes.js'
import classRoutes from '@/routes/ClassRoutes.js'
import feeRoutes from '@/routes/FeeRoutes.js'
import gradeRoutes from '@/routes/GradeRoutes.js'
import examRoutes from '@/routes/ExamRoutes.js'
import registrationLinksRoutes from '@/routes/registrationLinksRoutes.js'
import resultRoutes from '@/routes/ResultRoutes.js'
import schoolRoutes from '@/routes/SchoolRoutes.js'
import sectionRoutes from '@/routes/SectionRoutes.js'
import subjectRoutes from '@/routes/SubjectRoutes.js'
import teacherRoutes from '@/routes/TeacherRoutes.js'
import TimeTableRoutes from '@/routes/TimeTableRoutes.js'
import userRoutes from '@/routes/UserRoutes.js'

const API_PREFIX = '/api/v1'
const health = createHealth({
    defaultTimeoutMs: 2_000,
    checks: [
        {
            name: 'database',
            critical: true,
            timeoutMs: 2_000,
            run: () => sequelize.authenticate(),
        },
    ],
})

export function createApp(shutdown?: GracefulShutdown): Express {
    const app = express()
    app.set('trust proxy', env.TRUST_PROXY_HOPS)

    if (shutdown) app.use(createShutdownMiddleware(shutdown))

    app.use(helmet())
    app.use(
        cors({ origin: env.CORS_ORIGINS, credentials: true, maxAge: 86_400 }),
    )
    app.use(generalLimiter)
    app.use(express.json({ limit: '1mb' }))
    app.use(express.urlencoded({ extended: false, limit: '1mb' }))
    app.use(cookieParser())
    app.use(protectCookieAuthenticatedRequests)
    app.use(requestLogger)
    app.use(compression())

    app.use(
        `${API_PREFIX}/uploadthing`,
        createRouteHandler({
            router: uploadRouter,
            config: env.UPLOADTHING_TOKEN
                ? { token: env.UPLOADTHING_TOKEN }
                : undefined,
        }),
    )

    app.use(
        `${API_PREFIX}/api-docs`,
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec),
    )
    app.get(`${API_PREFIX}/openapi.json`, (_request, response) => {
        response.type('application/json').send(swaggerSpec)
    })
    /**
     * @openapi
     * /health/ready:
     *   get:
     *     summary: Check API and database readiness
     *     tags: [Health]
     *     security: []
     *     responses:
     *       200:
     *         description: API and its critical dependencies are ready.
     *       503:
     *         description: A critical dependency is unavailable.
     */
    registerExpressHealthRoute(app, health, `${API_PREFIX}/health/ready`)

    app.use(`${API_PREFIX}/users`, userRoutes)
    app.use(`${API_PREFIX}/teachers`, teacherRoutes)
    app.use(`${API_PREFIX}/classes`, classRoutes)
    app.use(`${API_PREFIX}/sections`, sectionRoutes)
    app.use(`${API_PREFIX}/timetables`, TimeTableRoutes)
    app.use(`${API_PREFIX}/exams`, examRoutes)
    app.use(`${API_PREFIX}/results`, resultRoutes)
    app.use(`${API_PREFIX}/subjects`, subjectRoutes)
    app.use(`${API_PREFIX}/fee`, feeRoutes)
    app.use(`${API_PREFIX}/auth`, authRoutes)
    app.use(`${API_PREFIX}/grades`, gradeRoutes)
    app.use(`${API_PREFIX}/schools`, schoolRoutes)
    app.use(`${API_PREFIX}/registration-link`, registrationLinksRoutes)
    app.use(`${API_PREFIX}/admins`, adminRoutes)

    app.use(handleInvalidJSON, handleValidationErrors, errorHandler)
    return app
}

export async function startServer(): Promise<Server> {
    await sequelize.authenticate()
    if (env.NODE_ENV !== 'production') await sequelize.sync()

    const tracker = new NodeConnectionTracker()
    const shutdown = new GracefulShutdown({
        connectionTracker: tracker,
        installSignalHandlers: false,
    })
    const app = createApp(shutdown)
    const trackerServer = createServer(app)
    tracker.attach(trackerServer)

    shutdown.addTask(createExpressShutdownTask(trackerServer))
    shutdown.addTask({
        name: 'sequelize',
        priority: PRIORITY.DB_POOL,
        handler: () => sequelize.close(),
    })

    const handleSignal = (signal: ShutdownReason): void => {
        void shutdown
            .shutdown(signal)
            .then(({ success }) => {
                process.exitCode = success ? 0 : 1
            })
            .catch((error: unknown) => {
                console.error('Graceful shutdown failed', error)
                process.exitCode = 1
            })
    }
    process.once('SIGTERM', () => handleSignal('SIGTERM'))
    process.once('SIGINT', () => handleSignal('SIGINT'))

    await new Promise<void>((resolveListen, rejectListen) => {
        trackerServer.once('error', rejectListen)
        trackerServer.listen(env.PORT, '0.0.0.0', () => {
            trackerServer.removeListener('error', rejectListen)
            resolveListen()
        })
    })

    console.info(`Server is listening on port ${env.PORT}`)
    return trackerServer
}

if (
    process.argv[1] &&
    fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
    void startServer().catch((error: unknown) => {
        console.error('Failed to start server', error)
        process.exitCode = 1
    })
}
