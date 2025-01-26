import express from 'express'
import sequelize from './config/database'
import router from './routes/UserRoutes'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { authenticate } from './middleware/auth'
import { generalLimiter } from './middleware/rateLimit.middleware'
import { requestLogger } from './middleware/loggin.middleware'
import { acceptStudentApplication } from './services/user.service'

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
    app.use('/users', router)
    app.get('/protected', authenticate, (req, res) => {
        res.json({ message: 'You have access!', user: req.user })
    })
}

const startServer = async () => {
    try {
        // Database connection
        await sequelize.authenticate()
        console.log('Database connection established successfully')

        // Configure middleware and routes
        configureMiddleware(app)
        configureRoutes(app)

        // Start server
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
