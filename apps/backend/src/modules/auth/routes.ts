import { Router } from 'express'
import { createAuthController } from './container'

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next)

export function authModuleRoutes(): Router {
    const router = Router()
    const controller = createAuthController()

    router.post('/register', asyncHandler(controller.register.bind(controller)))
    router.post('/login', asyncHandler(controller.login.bind(controller)))
    router.post('/logout', asyncHandler(controller.logout.bind(controller)))

    return router
}
