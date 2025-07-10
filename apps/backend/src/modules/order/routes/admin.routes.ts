import { Router } from 'express'
import { OrderController } from '../presentation/controllers/order.controller'
import { authMiddleware } from '@/common/middlewares/auth.middleware'
import { adminMiddleware } from '@/common/middlewares/admin.middleware'

export function createOrderAdminRoutes(controller: OrderController): Router {
    const router = Router()

    // All admin routes require authentication + admin role
    router.use(authMiddleware)
    router.use(adminMiddleware)

    // Admin-only order management routes
    router.put('/:id', controller.updateOrder.bind(controller))
    router.put('/:id/status', controller.updateOrder.bind(controller)) // For status-only updates

    return router
}
