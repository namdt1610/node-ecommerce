"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderTrackingRoutes = createOrderTrackingRoutes;
const express_1 = require("express");
const auth_middleware_1 = require("@/common/middlewares/auth.middleware");
function createOrderTrackingRoutes(controller) {
    const router = (0, express_1.Router)();
    // All tracking routes require authentication
    router.use(auth_middleware_1.authMiddleware);
    // Get order tracking information
    router.get('/:orderId', controller.getOrderTracking.bind(controller));
    // Start order tracking simulation
    router.post('/:orderId/start', controller.startOrderTracking.bind(controller));
    // Join order tracking room
    router.post('/:orderId/join', controller.joinOrderTracking.bind(controller));
    return router;
}
