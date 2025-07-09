import { Router } from 'express'
import { createUserController } from './container'
import { authMiddleware } from '@/common/middlewares/auth.middleware'

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next)

export function userModuleRoutes(): Router {
    const router = Router()
    const controller = createUserController()

    // Profile routes (require authentication)
    router.get(
        '/profile',
        authMiddleware,
        asyncHandler(controller.getProfile.bind(controller))
    )
    router.put(
        '/profile',
        authMiddleware,
        asyncHandler(controller.updateProfile.bind(controller))
    )

    // Admin routes (require authentication)
    router.get(
        '/',
        authMiddleware,
        asyncHandler(controller.getAllUsers.bind(controller))
    )
    router.delete(
        '/:id',
        authMiddleware,
        asyncHandler(controller.deleteUser.bind(controller))
    )

    return router
}
