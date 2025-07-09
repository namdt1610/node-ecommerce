import { Router } from 'express'
import { createPaymentController } from './container'
import { authMiddleware } from '@/common/middlewares/auth.middleware'

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next)

export function paymentModuleRoutes(): Router {
    const router = Router()
    const controller = createPaymentController()

    // Create payment intent (requires authentication)
    router.post(
        '/intent',
        authMiddleware,
        asyncHandler(controller.createPaymentIntent.bind(controller))
    )

    // Confirm payment (public for client-side confirmation)
    router.post(
        '/confirm',
        asyncHandler(controller.confirmPayment.bind(controller))
    )

    // Refund payment (requires authentication - typically admin only)
    router.post(
        '/refund',
        authMiddleware,
        asyncHandler(controller.refundPayment.bind(controller))
    )

    // Get payment status
    router.get(
        '/status/:paymentIntentId',
        authMiddleware,
        asyncHandler(controller.getPaymentStatus.bind(controller))
    )

    // Stripe webhook endpoint (no auth required, validated by signature)
    router.post(
        '/webhook',
        asyncHandler(controller.handleWebhook.bind(controller))
    )

    return router
}
