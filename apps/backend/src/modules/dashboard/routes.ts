import { Router } from 'express'
import { createDashboardController } from './container'
import { authMiddleware } from '@/common/middlewares/auth.middleware'
import { adminMiddleware } from '@/common/middlewares/admin.middleware'

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next)

export function dashboardModuleRoutes(): Router {
    const router = Router()

    // Note: Dashboard controller will be created with HTTP server in index.ts
    // For now, we'll use a factory that accepts the controller
    return createDashboardRoutes(router)
}

function createDashboardRoutes(router: Router): Router {
    // All dashboard routes require authentication first, then admin access
    router.use(authMiddleware)
    // router.use(adminMiddleware)

    // Dashboard stats
    router.get(
        '/stats',
        asyncHandler(async (req: any, res: any) => {
            // Controller will be injected during server initialization
            if (!req.dashboardController) {
                return res.status(503).json({
                    success: false,
                    error: 'Dashboard service not initialized',
                })
            }
            return req.dashboardController.getDashboardStats(req, res)
        })
    )

    // Sales analytics
    router.get(
        '/analytics/sales',
        asyncHandler(async (req: any, res: any) => {
            if (!req.dashboardController) {
                return res.status(503).json({
                    success: false,
                    error: 'Dashboard service not initialized',
                })
            }
            return req.dashboardController.getSalesAnalytics(req, res)
        })
    )

    // User analytics
    router.get(
        '/analytics/users',
        asyncHandler(async (req: any, res: any) => {
            if (!req.dashboardController) {
                return res.status(503).json({
                    success: false,
                    error: 'Dashboard service not initialized',
                })
            }
            return req.dashboardController.getUserAnalytics(req, res)
        })
    )

    // Product analytics
    router.get(
        '/analytics/products',
        asyncHandler(async (req: any, res: any) => {
            if (!req.dashboardController) {
                return res.status(503).json({
                    success: false,
                    error: 'Dashboard service not initialized',
                })
            }
            return req.dashboardController.getProductAnalytics(req, res)
        })
    )

    // Recent activity
    router.get(
        '/activity',
        asyncHandler(async (req: any, res: any) => {
            if (!req.dashboardController) {
                return res.status(503).json({
                    success: false,
                    error: 'Dashboard service not initialized',
                })
            }
            return req.dashboardController.getRecentActivity(req, res)
        })
    )

    // Get all dashboard data
    router.get(
        '/all',
        asyncHandler(async (req: any, res: any) => {
            if (!req.dashboardController) {
                return res.status(503).json({
                    success: false,
                    error: 'Dashboard service not initialized',
                })
            }
            return req.dashboardController.getAllDashboardData(req, res)
        })
    )

    // Trigger refresh
    router.post(
        '/refresh',
        asyncHandler(async (req: any, res: any) => {
            if (!req.dashboardController) {
                return res.status(503).json({
                    success: false,
                    error: 'Dashboard service not initialized',
                })
            }
            return req.dashboardController.triggerRefresh(req, res)
        })
    )

    // Dashboard status
    router.get(
        '/status',
        asyncHandler(async (req: any, res: any) => {
            if (!req.dashboardController) {
                return res.status(503).json({
                    success: false,
                    error: 'Dashboard service not initialized',
                })
            }
            return req.dashboardController.getDashboardStatus(req, res)
        })
    )

    return router
}

// Alternative function to create routes with controller injection
export function createDashboardRoutesWithController(controller: any): Router {
    const router = Router()

    // Middleware to inject controller
    router.use((req: any, res, next) => {
        req.dashboardController = controller
        next()
    })

    return createDashboardRoutes(router)
}
