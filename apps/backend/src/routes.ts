import { Express } from 'express'
import { authRoutes } from './modules/auth'
import { userRoutes } from './modules/user'
import { categoryRoutes } from './modules/category'
import { productRoutes } from './modules/product'
import { orderRoutes } from './modules/order'
import { createOrderAdminRoutes } from './modules/order/routes/admin.routes'
import { createOrderContainer } from './modules/order/container'
import { cartRoutes } from './modules/cart'
import { paymentRoutes } from './modules/payment'
import { dashboardRoutes } from './modules/dashboard'
import { inventoryModuleRoutes } from './modules/inventory'
import reviewRoutes from './routes/reviews'
import { Server as SocketIOServer } from 'socket.io'
import { GlobalContainer } from '@/core/global-container'
const globalContainer = new GlobalContainer()

export function registerAllRoutes(app: Express, io?: SocketIOServer) {
    // API Routes - core modules
    app.use('/api/auth', authRoutes())
    app.use('/api/users', userRoutes())
    app.use('/api/categories', categoryRoutes)
    app.use('/api/products', productRoutes())
    app.use('/api/orders', orderRoutes(io))
    app.use('/api/cart', cartRoutes())
    app.use('/api/payments', paymentRoutes())
    app.use('/api/dashboard', dashboardRoutes())
    app.use('/api/inventory', inventoryModuleRoutes(globalContainer))
    app.use('/api/reviews', reviewRoutes)

    // Admin routes (require admin role)
    if (io) {
        const orderContainer = createOrderContainer(io)
        app.use(
            '/api/admin/orders',
            createOrderAdminRoutes(orderContainer.orderController)
        )
    }
}
