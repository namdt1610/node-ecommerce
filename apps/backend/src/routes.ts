import { Express } from 'express'
import { authRoutes } from './modules/auth'
import { userRoutes } from './modules/user'
import { categoryRoutes } from './modules/category'
import { productRoutes } from './modules/product'
import { orderRoutes } from './modules/order'
import { cartRoutes } from './modules/cart'
import { paymentRoutes } from './modules/payment'
import { dashboardRoutes } from './modules/dashboard'
import reviewRoutes from './routes/reviews'

export function registerAllRoutes(app: Express) {
    // API Routes - core modules
    app.use('/api/auth', authRoutes())
    app.use('/api/users', userRoutes())
    app.use('/api/categories', categoryRoutes)
    app.use('/api/products', productRoutes())
    app.use('/api/orders', orderRoutes)
    app.use('/api/cart', cartRoutes())
    app.use('/api/payments', paymentRoutes())
    app.use('/api/dashboard', dashboardRoutes())
    app.use('/api/reviews', reviewRoutes)
}
