import { Router, Request, Response, NextFunction } from 'express'
import { asyncHandler } from '@/utils/async-handler'

/**
 * Route configuration interface
 */
export interface RouteConfig {
    method: 'get' | 'post' | 'put' | 'patch' | 'delete'
    path: string
    handler: string // method name on controller
    middlewares?: Array<
        (req: Request, res: Response, next: NextFunction) => void
    >
    skipAsyncHandler?: boolean
}

/**
 * Create routes from configuration array
 * This eliminates repetitive route binding code
 */
export function createRoutes(
    router: Router,
    controller: any,
    routes: RouteConfig[]
): Router {
    routes.forEach(
        ({
            method,
            path,
            handler,
            middlewares = [],
            skipAsyncHandler = false,
        }) => {
            const controllerMethod = controller[handler]

            if (!controllerMethod) {
                throw new Error(`Controller method '${handler}' not found`)
            }

            const boundMethod = controllerMethod.bind(controller)
            const finalHandler = skipAsyncHandler
                ? boundMethod
                : asyncHandler(boundMethod)

            if (middlewares.length > 0) {
                router[method](path, ...middlewares, finalHandler)
            } else {
                router[method](path, finalHandler)
            }
        }
    )

    return router
}

/**
 * Create CRUD routes with standard patterns
 */
export interface CrudRouteConfig {
    basePath?: string
    middlewares?: {
        all?: Array<(req: Request, res: Response, next: NextFunction) => void>
        create?: Array<
            (req: Request, res: Response, next: NextFunction) => void
        >
        read?: Array<(req: Request, res: Response, next: NextFunction) => void>
        update?: Array<
            (req: Request, res: Response, next: NextFunction) => void
        >
        delete?: Array<
            (req: Request, res: Response, next: NextFunction) => void
        >
    }
    customRoutes?: RouteConfig[]
}

export function createCrudRoutes(
    router: Router,
    controller: any,
    config: CrudRouteConfig = {}
): Router {
    const { basePath = '', middlewares = {}, customRoutes = [] } = config

    // Apply common middlewares
    if (middlewares.all) {
        router.use(basePath, ...middlewares.all)
    }

    // Standard CRUD routes
    const crudRoutes: RouteConfig[] = [
        {
            method: 'post',
            path: basePath || '/',
            handler: 'create',
            middlewares: middlewares.create,
        },
        {
            method: 'get',
            path: basePath || '/',
            handler: 'getAll',
            middlewares: middlewares.read,
        },
        {
            method: 'get',
            path: `${basePath}/:id`,
            handler: 'getById',
            middlewares: middlewares.read,
        },
        {
            method: 'put',
            path: `${basePath}/:id`,
            handler: 'update',
            middlewares: middlewares.update,
        },
        {
            method: 'delete',
            path: `${basePath}/:id`,
            handler: 'delete',
            middlewares: middlewares.delete,
        },
    ]

    // Create CRUD routes
    createRoutes(router, controller, crudRoutes)

    // Add custom routes
    if (customRoutes.length > 0) {
        createRoutes(router, controller, customRoutes)
    }

    return router
}

/**
 * Utility to create controller method with error handling
 */
export function withErrorHandling<T extends any[], R>(
    fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
        try {
            return await fn(...args)
        } catch (error) {
            // Log error here if needed
            throw error
        }
    }
}
