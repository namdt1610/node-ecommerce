import { Router } from 'express'
import { createAuthController } from './container'
import { createRoutes, RouteConfig } from '@/common/utils/route.utils'

export function authModuleRoutes(): Router {
    const router = Router()
    const controller = createAuthController()

    const routes: RouteConfig[] = [
        {
            method: 'post',
            path: '/register',
            handler: 'register',
        },
        {
            method: 'post',
            path: '/login',
            handler: 'login',
        },
        {
            method: 'post',
            path: '/logout',
            handler: 'logout',
        },
    ]

    return createRoutes(router, controller, routes)
}
