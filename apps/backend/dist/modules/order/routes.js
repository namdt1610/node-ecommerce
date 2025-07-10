"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModuleRoutes = orderModuleRoutes;
const express_1 = require("express");
const container_1 = require("./container");
const tracking_routes_1 = require("./routes/tracking.routes");
const auth_middleware_1 = require("@/common/middlewares/auth.middleware");
function orderModuleRoutes(io) {
    const router = (0, express_1.Router)();
    const container = (0, container_1.createOrderContainer)(io);
    const controller = container.orderController;
    // All order routes require authentication
    router.use(auth_middleware_1.authMiddleware);
    // User routes (read-only and create)
    router.post('/', controller.createOrder.bind(controller));
    router.get('/', controller.getAllOrders.bind(controller));
    router.get('/:id', controller.getOrderById.bind(controller));
    // Note: Order updates are handled in admin routes (/api/admin/orders/:id)
    // Users cannot update orders, only view and track them
    // Order tracking routes (only if Socket.IO is available)
    if (container.orderTrackingController) {
        router.use('/tracking', (0, tracking_routes_1.createOrderTrackingRoutes)(container.orderTrackingController));
    }
    return router;
}
