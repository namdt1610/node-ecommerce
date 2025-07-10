import { Router } from 'express'
import { createOrderContainer } from './container'
import { createOrderTrackingRoutes } from './routes/tracking.routes'
import { authMiddleware } from '@/common/middlewares/auth.middleware'
import { Server as SocketIOServer } from 'socket.io'

export function orderModuleRoutes(io?: SocketIOServer): Router {
    const router = Router()
    const container = createOrderContainer(io)
    const controller = container.orderController

    // All order routes require authentication
    router.use(authMiddleware)

    // User routes (read-only and create)
    router.post('/', controller.createOrder.bind(controller))
    router.get('/', controller.getAllOrders.bind(controller))
    router.get('/:id', controller.getOrderById.bind(controller))

    // Note: Order updates are handled in admin routes (/api/admin/orders/:id)
    // Users cannot update orders, only view and track them

    // Order tracking routes (only if Socket.IO is available)
    if (container.orderTrackingController) {
        router.use(
            '/tracking',
            createOrderTrackingRoutes(container.orderTrackingController)
        )
    }

    return router
}
