import express from 'express'
import sequelize from './config/database'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import userRoutes from '@/routes/UserRoutes'
import teacherRoutes from '@/routes/TeacherRoutes'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { generalLimiter } from './middleware/rateLimit.middleware'
import { requestLogger } from './middleware/loggin.middleware'
import {
    deleteExpiredPasswordResetTokens,
    deleteExpiredSessions,
} from './cron/session'

// Define User interface
interface User {
    id: string
    email: string
    role: string
}

// Declare type augmentation
declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

const app = express()
const port = process.env.PORT || 3000

// Combine all middleware in a single function for better organization
const configureMiddleware = (app: express.Application) => {
    // Security middleware
    app.use(helmet())
    app.use(cors())
    app.use(generalLimiter)

    // Swagger Documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    // Request parsing middleware
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())

    // Logging middleware
    app.use(requestLogger)

    // Performance middleware
    app.use(compression())
}

// Configure routes
const configureRoutes = (app: express.Application) => {
    app.use('/api/v1/users', userRoutes)
    app.use('/api/v1/teachers', teacherRoutes)
}

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
        // Start server
        await sequelize.sync({ alter: true })
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
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
