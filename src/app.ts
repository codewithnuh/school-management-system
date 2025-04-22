import express from 'express'
import sequelize from '@/config/database.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from '@/config/swagger.js'
import userRoutes from '@/routes/UserRoutes.js'
import teacherRoutes from '@/routes/TeacherRoutes.js'
import feeRoutes from '@/routes/FeeRoutes.js'
import authRoutes from '@/routes/AuthRoutes.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import process from 'process'
import helmet from 'helmet'
import { createRouteHandler } from 'uploadthing/express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { generalLimiter } from './middleware/rateLimit.middleware.js'
import { requestLogger } from './middleware/loggin.middleware.js'
import {
    deleteExpiredPasswordResetTokens,
    deleteExpiredSessions,
} from '@/cron/session.js'
import TimeTableRoutes from '@/routes/TimeTableRoutes.js'
import classRoutes from '@/routes/ClassRoutes.js'
import examRoutes from '@/routes/ExamRoutes.js'
import resultRoutes from '@/routes/ResultRoutes.js'
import gradeRoutes from '@/routes/GradeRoutes.js'
import subjectRoutes from '@/routes/SubjectRoutes.js'
import sectionRoutes from './routes/SectionRoutes.js'
// import seed from '@/seeders/index.js'
import {
    handleInvalidJSON,
    handleValidationErrors,
    errorHandler,
} from './middleware/error.middleware.js'
import { uploadRouter } from './config/uploadthing.js'
// import seed from './seeders/index.js'

// Define User interface
interface User {
    userid: string
    email: string
    role: string
}

// Declare type augmentation
// Extend Express Request interface
declare module 'express' {
    interface Request {
        user?: User
    }
}

const app = express()
const PORT = process.env.PORT || 3000

// Combine all middleware in a single function for better organization
const configureMiddleware = (app: express.Application) => {
    // Security middleware

    // app.use(csrf({ cookie: true }))
    app.use(helmet())
    app.use(
        cors({
            origin: [
                'https://school-management-system-gray.vercel.app',
                'http://localhost:3000',
                ' http://localhost:4173/',
            ], // ✅ no trailing slash
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            maxAge: 86400,
        }),
    )
    app.use(generalLimiter)
    app.use(bodyParser.json())

    // Swagger Documentation
    app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Request parsing middleware
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    // Logging middleware
    app.use(requestLogger)

    // Performance middleware
    app.use(compression())

    app.use(handleInvalidJSON as express.ErrorRequestHandler)
    app.use(handleValidationErrors as express.ErrorRequestHandler)
    app.use(errorHandler)
}

// Configure routes
const configureRoutes = (app: express.Application) => {
    app.use('/api/v1/users', userRoutes)
    app.use('/api/v1/teachers', teacherRoutes)
    app.use('/api/v1/classes', classRoutes)
    app.use('/api/v1/sections', sectionRoutes)
    app.use('/api/v1/timetables', TimeTableRoutes)
    // Exam Routes
    app.use('/api/v1/exams', examRoutes)
    // Uploadthing routes
    app.use(
        '/api/v1/uploadthing',
        createRouteHandler({
            router: uploadRouter,
            config: { token: process.env.UPLOADTHING_TOKEN },
        }),
    )
    // Result Routes
    app.use('/api/v1/results', resultRoutes)
    app.use('/api/v1/subjects', subjectRoutes)
    //Fee Routes
    app.use('/api/v1/fee', feeRoutes)
    //Auth Routes
    app.use('/api/v1/auth', authRoutes)
    // Grade Routes
    app.use('/api/v1/grades', gradeRoutes)
    // app.use('/api/v1/timetable/class', ClassRoutes)
    // Route to access the raw openapi.json file
    app.get('/api/v1/openapi.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}
console.log('server....')

const startServer = async () => {
    try {
        // Database connection
        await sequelize.authenticate()
        console.log('Database connection established successfully')
        // Configure middleware and routes
        configureMiddleware(app)

        configureRoutes(app)
        deleteExpiredSessions()
        deleteExpiredPasswordResetTokens()

        // await seed()
        app.listen(Number(PORT), '0.0.0.0', () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        process.exit(1)
    }
}

// Start the application
startServer().catch(error => {
    console.error('Failed to start server:', error)
    process.exit(1)
})
