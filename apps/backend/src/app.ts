import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import helmet from 'helmet'
import compression from 'compression'
import fs from 'fs'

// Custom imports
import { errorHandler } from './common/middlewares/error-handler'
import { loggerMiddleware } from './common/middlewares/logger'
import { apiLimiter } from './common/middlewares/rate-limit'
import systemRoutes from './routes/system'

const app = express()

// Core middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('combined'))
app.use(helmet())
app.use(compression())

// CORS
app.use(
    cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
    })
)

// Rate limit API
app.use('/api', apiLimiter)

// Uploads
const uploadsPath = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true })
}
app.use('/uploads', express.static(uploadsPath))

// Logging
app.use(loggerMiddleware)

// Routes
app.use(systemRoutes)

// Error handler
app.use(errorHandler)

export default app
