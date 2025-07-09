"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardModuleRoutes = dashboardModuleRoutes;
exports.createDashboardRoutesWithController = createDashboardRoutesWithController;
const express_1 = require("express");
const auth_middleware_1 = require("@/common/middlewares/auth.middleware");
const admin_middleware_1 = require("@/common/middlewares/admin.middleware");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
function dashboardModuleRoutes() {
    const router = (0, express_1.Router)();
    // Note: Dashboard controller will be created with HTTP server in index.ts
    // For now, we'll use a factory that accepts the controller
    return createDashboardRoutes(router);
}
function createDashboardRoutes(router) {
    // All dashboard routes require authentication first, then admin access
    router.use(auth_middleware_1.authMiddleware);
    router.use(admin_middleware_1.adminMiddleware);
    // Dashboard stats
    router.get('/stats', asyncHandler(async (req, res) => {
        // Controller will be injected during server initialization
        if (!req.dashboardController) {
            return res.status(503).json({
                success: false,
                error: 'Dashboard service not initialized',
            });
        }
        return req.dashboardController.getDashboardStats(req, res);
    }));
    // Sales analytics
    router.get('/analytics/sales', asyncHandler(async (req, res) => {
        if (!req.dashboardController) {
            return res.status(503).json({
                success: false,
                error: 'Dashboard service not initialized',
            });
        }
        return req.dashboardController.getSalesAnalytics(req, res);
    }));
    // User analytics
    router.get('/analytics/users', asyncHandler(async (req, res) => {
        if (!req.dashboardController) {
            return res.status(503).json({
                success: false,
                error: 'Dashboard service not initialized',
            });
        }
        return req.dashboardController.getUserAnalytics(req, res);
    }));
    // Product analytics
    router.get('/analytics/products', asyncHandler(async (req, res) => {
        if (!req.dashboardController) {
            return res.status(503).json({
                success: false,
                error: 'Dashboard service not initialized',
            });
        }
        return req.dashboardController.getProductAnalytics(req, res);
    }));
    // Recent activity
    router.get('/activity', asyncHandler(async (req, res) => {
        if (!req.dashboardController) {
            return res.status(503).json({
                success: false,
                error: 'Dashboard service not initialized',
            });
        }
        return req.dashboardController.getRecentActivity(req, res);
    }));
    // Get all dashboard data
    router.get('/all', asyncHandler(async (req, res) => {
        if (!req.dashboardController) {
            return res.status(503).json({
                success: false,
                error: 'Dashboard service not initialized',
            });
        }
        return req.dashboardController.getAllDashboardData(req, res);
    }));
    // Trigger refresh
    router.post('/refresh', asyncHandler(async (req, res) => {
        if (!req.dashboardController) {
            return res.status(503).json({
                success: false,
                error: 'Dashboard service not initialized',
            });
        }
        return req.dashboardController.triggerRefresh(req, res);
    }));
    // Dashboard status
    router.get('/status', asyncHandler(async (req, res) => {
        if (!req.dashboardController) {
            return res.status(503).json({
                success: false,
                error: 'Dashboard service not initialized',
            });
        }
        return req.dashboardController.getDashboardStatus(req, res);
    }));
    return router;
}
// Alternative function to create routes with controller injection
function createDashboardRoutesWithController(controller) {
    const router = (0, express_1.Router)();
    // Middleware to inject controller
    router.use((req, res, next) => {
        req.dashboardController = controller;
        next();
    });
    return createDashboardRoutes(router);
}
