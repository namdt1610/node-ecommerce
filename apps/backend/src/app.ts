import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

// Load environment variables from the backend directory
const envPath = path.resolve(__dirname, '../.env')
dotenv.config({ path: envPath })

// Also try to load from current directory as fallback
dotenv.config()

console.log('Environment loaded:')
console.log('- PORT:', process.env.PORT)
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
console.log('- NODE_ENV:', process.env.NODE_ENV)

// Import route registration function will be done in index.ts

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
    origin: '*',
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

// Routes will be registered in index.ts with Socket.IO instance

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
        message: 'NodeApple API',
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
