import { Router } from 'express'
import { createProductController } from './container'

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next)

export function productModuleRoutes(): Router {
    const router = Router()
    const controller = createProductController()

    router.get('/', asyncHandler(controller.getAllProducts.bind(controller)))
    router.get(
        '/search',
        asyncHandler(controller.searchProducts.bind(controller))
    )
    router.get('/:id', asyncHandler(controller.getProductById.bind(controller)))
    router.post('/', asyncHandler(controller.createProduct.bind(controller)))
    router.put('/:id', asyncHandler(controller.updateProduct.bind(controller)))
    router.delete(
        '/:id',
        asyncHandler(controller.deleteProduct.bind(controller))
    )

    return router
}
