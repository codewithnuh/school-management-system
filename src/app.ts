import sequelize from './config/database'
import express from 'express'
import router from './routes/UserRoutes'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
const app = express()
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
        app.use('/users', router)
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

startServer()
