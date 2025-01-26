import sequelize from './config/database'
import express from 'express'
import router from './routes/UserRoutes'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { acceptStudentApplication } from './services/user.service'
import cookieParser from 'cookie-parser'
const app = express()
app.use(cookieParser())
// Middleware to parse JSON request bodies
app.use(express.json())
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }))
// Enable CORS
app.use(cors())

// Secure your app by setting various HTTP headers
app.use(helmet())

// HTTP request logger
app.use(morgan('combined'))

// Compress response bodies
app.use(compression())
const port = process.env.PORT || 3000

async function startServer() {
    try {
        await sequelize.authenticate()
        //2083e10b-2c08-442c-8065-e5c69731ea31
        // await acceptStudentApplication(1)
        app.use('/users', router)
        app.listen(port, () => {
            console.log(`Server is running on port http:localhost://${port}`)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

startServer()
