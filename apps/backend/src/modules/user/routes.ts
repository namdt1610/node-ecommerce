import { Router } from 'express'
import { createUserController } from './container'
import { authMiddleware } from '@/common/middlewares/auth.middleware'
import { createRoutes, RouteConfig } from '@/common/utils/route.utils'

export function userModuleRoutes(): Router {
    const router = Router()
    const controller = createUserController()

    const routes: RouteConfig[] = [
        // Profile routes (require authentication)
        {
            method: 'get',
            path: '/profile',
            handler: 'getProfile',
            middlewares: [authMiddleware],
        },
        {
            method: 'put',
            path: '/profile',
            handler: 'updateProfile',
            middlewares: [authMiddleware],
        },
        // Admin routes (require authentication)
        {
            method: 'get',
            path: '/',
            handler: 'getAllUsers',
            middlewares: [authMiddleware],
        },
        {
            method: 'delete',
            path: '/:id',
            handler: 'deleteUser',
            middlewares: [authMiddleware],
        },
    ]

    return createRoutes(router, controller, routes)
}
