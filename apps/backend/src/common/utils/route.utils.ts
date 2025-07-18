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
                console.warn(
                    `Controller method '${handler}' not found, skipping route ${method.toUpperCase()} ${path}`
                )
                return // Skip this route instead of throwing error
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
    methodMapping?: {
        create?: string
        getAll?: string
        getById?: string
        update?: string
        delete?: string
    }
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
    const {
        basePath = '',
        middlewares = {},
        customRoutes = [],
        methodMapping = {},
    } = config

    // Auto-detect methods if not provided
    const detectedMethods = detectCrudMethods(controller)

    // Merge with provided mapping, preferring provided over detected
    const methods = {
        create: methodMapping.create || detectedMethods.create,
        getAll: methodMapping.getAll || detectedMethods.getAll,
        getById: methodMapping.getById || detectedMethods.getById,
        update: methodMapping.update || detectedMethods.update,
        delete: methodMapping.delete || detectedMethods.delete,
    }

    // Apply common middlewares
    if (middlewares.all) {
        router.use(basePath, ...middlewares.all)
    }

    // Standard CRUD routes - only create if method exists
    const crudRoutes: RouteConfig[] = []

    if (methods.create) {
        crudRoutes.push({
            method: 'post',
            path: basePath || '/',
            handler: methods.create,
            middlewares: middlewares.create,
        })
    }

    if (methods.getAll) {
        crudRoutes.push({
            method: 'get',
            path: basePath || '/',
            handler: methods.getAll,
            middlewares: middlewares.read,
        })
    }

    if (methods.getById) {
        crudRoutes.push({
            method: 'get',
            path: `${basePath}/:id`,
            handler: methods.getById,
            middlewares: middlewares.read,
        })
    }

    if (methods.update) {
        crudRoutes.push({
            method: 'put',
            path: `${basePath}/:id`,
            handler: methods.update,
            middlewares: middlewares.update,
        })
    }

    if (methods.delete) {
        crudRoutes.push({
            method: 'delete',
            path: `${basePath}/:id`,
            handler: methods.delete,
            middlewares: middlewares.delete,
        })
    }

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

/**
 * Auto-detect controller method names based on common patterns
 */
export function detectCrudMethods(controller: any): {
    create?: string
    getAll?: string
    getById?: string
    update?: string
    delete?: string
} {
    const methods = Object.getOwnPropertyNames(
        Object.getPrototypeOf(controller)
    ).filter(
        (name) =>
            typeof controller[name] === 'function' && name !== 'constructor'
    )

    const patterns = {
        create: ['create', 'add', 'post'],
        getAll: ['getAll', 'list', 'index', 'get'],
        getById: ['getById', 'get', 'find', 'show'],
        update: ['update', 'put', 'patch', 'edit'],
        delete: ['delete', 'remove', 'destroy'],
    }

    const detected: any = {}

    for (const [crudOp, possibleNames] of Object.entries(patterns)) {
        for (const pattern of possibleNames) {
            const found = methods.find(
                (method) =>
                    method.toLowerCase().includes(pattern.toLowerCase()) ||
                    method.toLowerCase() === pattern.toLowerCase()
            )
            if (found) {
                detected[crudOp] = found
                break
            }
        }
    }

    return detected
}
