import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import fs from 'fs'
import errorHandler from './middlewares/errorHandler'

// Import Routes
import authRoutes from './routes/AuthRoutes'
import userRoutes from './routes/UserRoutes'
import categoryRoutes from './routes/CategoryRoutes'
import productRoutes from './routes/ProductRoutes'
import inventoryRoutes from './routes/InventoryRoutes'
import orderRoutes from './routes/OrderRoutes'
import cartRoutes from './routes/CartRoutes'
import dashboardRoutes from './routes/DashboardRoutes'
import reviewRoutes from './routes/ReviewRoutes'
import warehouseRoutes from './routes/WarehouseRoutes'
import uploadRoutes from './routes/UploadRoutes'

const app = express()

// Middleware cơ bản
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

// Cấu hình CORS
const corsOptions = {
    origin: ['http://localhost:5173', 'https://mern-psi-nine.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'sentry-trace',
        'baggage',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Cấu hình thư mục lưu ảnh
const uploadsPath = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true })
}
app.use('/uploads', express.static(uploadsPath))

// Log request
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
})

// Import Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/warehouses', warehouseRoutes)
app.use('/api', uploadRoutes)

// Middleware xử lý lỗi chung
app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error('Lỗi:', err.stack)
        res.status(500).json({
            status: 'error',
            message: err.message || 'Lỗi máy chủ!',
        })
    }
)

app.use(errorHandler)

export default app
