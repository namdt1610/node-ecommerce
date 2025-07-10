"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderAdminRoutes = createOrderAdminRoutes;
const express_1 = require("express");
const auth_middleware_1 = require("@/common/middlewares/auth.middleware");
const admin_middleware_1 = require("@/common/middlewares/admin.middleware");
function createOrderAdminRoutes(controller) {
    const router = (0, express_1.Router)();
    // All admin routes require authentication + admin role
    router.use(auth_middleware_1.authMiddleware);
    router.use(admin_middleware_1.adminMiddleware);
    // Admin-only order management routes
    router.put('/:id', controller.updateOrder.bind(controller));
    router.put('/:id/status', controller.updateOrder.bind(controller)); // For status-only updates
    return router;
}
