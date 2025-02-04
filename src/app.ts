import express from 'express'
import sequelize from '@/config/database.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from '@/config/swagger.js'
import userRoutes from '@/routes/UserRoutes.js'
import teacherRoutes from '@/routes/TeacherRoutes.js'
// import cors from 'cors'
import process from 'process'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { generalLimiter } from './middleware/rateLimit.middleware.js'
import { requestLogger } from './middleware/loggin.middleware.js'
import {
    deleteExpiredPasswordResetTokens,
    deleteExpiredSessions,
} from './cron/session.js'
import TimeTableRoutes from '@/routes/TimeTableRoutes.js'
import classRoutes from '@/routes/ClassRoutes.js'
import examRoutes from '@/routes/ExamRoutes.js'
import examSubjectRoutes from '@/routes/ExamSubjectRoutes.js'
import resultRoutes from '@/routes/ResultRoutes.js'
import gradeRoutes from '@/routes/GradeRoutes.js'
// import seed from '@/seeders/index.js'

// Define User interface
interface User {
    id: string
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
const port = process.env.PORT || 3000

// Combine all middleware in a single function for better organization
const configureMiddleware = (app: express.Application) => {
    // Security middleware
    app.use(helmet())
    // app.use(cors())
    app.use(generalLimiter)

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
}

// Configure routes
const configureRoutes = (app: express.Application) => {
    app.use('/api/v1/users', userRoutes)
    app.use('/api/v1/teachers', teacherRoutes)
    app.use('/api/v1/classes', classRoutes)
    app.use('/api/v1/timetables', TimeTableRoutes)
    // Exam Routes
    app.use('/exams', examRoutes)

    // ExamSubject Routes
    app.use('/exam-subjects', examSubjectRoutes)

    // Result Routes
    app.use('/results', resultRoutes)

    // Grade Routes
    app.use('/grades', gradeRoutes)
    // app.use('/api/v1/timetable/class', ClassRoutes)
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
        await sequelize.sync({ alter: true })
        // await seed()
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
