import { Router } from 'express'
import { createCartContainer } from './container'
import { authMiddleware } from '@/common/middlewares/auth.middleware'
import prisma from '@/config/database'

export function cartModuleRoutes(): Router {
    const router = Router()
    const container = createCartContainer()
    const controller = container.cartController

    // All cart routes require authentication
    router.use(authMiddleware)

    router.get('/', controller.getCart.bind(controller))
    router.get('/count', controller.getCartItemsCount.bind(controller))
    router.post('/add', controller.addToCart.bind(controller))
    router.post('/items', controller.addToCart.bind(controller))
    router.put('/items/:itemId', controller.updateCartItem.bind(controller))
    router.delete('/items/:itemId', controller.removeFromCart.bind(controller))
    router.delete('/', controller.clearCart.bind(controller))

    return router
}
