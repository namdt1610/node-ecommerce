import { Router } from 'express'
import { OrderTrackingController } from '../presentation/controllers/order-tracking.controller'
import { authMiddleware } from '@/common/middlewares/auth.middleware'

export function createOrderTrackingRoutes(
    controller: OrderTrackingController
): Router {
    const router = Router()

    // All tracking routes require authentication
    router.use(authMiddleware)

    // Get order tracking information
    router.get('/:orderId', controller.getOrderTracking.bind(controller))

    // Start order tracking simulation
    router.post(
        '/:orderId/start',
        controller.startOrderTracking.bind(controller)
    )

    // Join order tracking room
    router.post('/:orderId/join', controller.joinOrderTracking.bind(controller))

    return router
}
