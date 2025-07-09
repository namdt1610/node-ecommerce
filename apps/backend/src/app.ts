import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import route registration function
import { registerAllRoutes } from './routes'

// Import working middlewares
import { errorHandler } from './common/middlewares/error-handler.middleware'

const app = express()

// Basic middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('combined'))

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Configure uploads directory
const uploadsPath = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true })
}
app.use('/uploads', express.static(uploadsPath))

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
})

// Register all API routes
registerAllRoutes(app)

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Server is running',
        environment: process.env.NODE_ENV || 'development',
    })
})

// API endpoints summary
app.get('/api', (req, res) => {
    res.json({
        message: 'Bookscape API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            categories: '/api/categories',
            products: '/api/products',
            orders: '/api/orders',
            cart: '/api/cart',
            reviews: '/api/reviews',
        },
        documentation: 'API documentation available at /api/docs',
        status: 'All systems operational',
    })
})

// Global error handler
app.use(errorHandler)

export default app
