import { Router } from 'express'
import { createProductController } from './container'
import { createCrudRoutes, RouteConfig } from '@/common/utils/route.utils'

export function productModuleRoutes(): Router {
    const router = Router()
    const controller = createProductController()

    // Custom routes that don't follow CRUD pattern
    const customRoutes: RouteConfig[] = [
        {
            method: 'get',
            path: '/search',
            handler: 'searchProducts',
        },
    ]

    // Create CRUD routes with custom additions
    return createCrudRoutes(router, controller, {
        customRoutes,
    })
}
