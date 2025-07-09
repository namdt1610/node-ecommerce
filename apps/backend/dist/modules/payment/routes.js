"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentModuleRoutes = paymentModuleRoutes;
const express_1 = require("express");
const container_1 = require("./container");
const auth_middleware_1 = require("@/common/middlewares/auth.middleware");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
function paymentModuleRoutes() {
    const router = (0, express_1.Router)();
    const controller = (0, container_1.createPaymentController)();
    // Create payment intent (requires authentication)
    router.post('/intent', auth_middleware_1.authMiddleware, asyncHandler(controller.createPaymentIntent.bind(controller)));
    // Confirm payment (public for client-side confirmation)
    router.post('/confirm', asyncHandler(controller.confirmPayment.bind(controller)));
    // Refund payment (requires authentication - typically admin only)
    router.post('/refund', auth_middleware_1.authMiddleware, asyncHandler(controller.refundPayment.bind(controller)));
    // Get payment status
    router.get('/status/:paymentIntentId', auth_middleware_1.authMiddleware, asyncHandler(controller.getPaymentStatus.bind(controller)));
    // Stripe webhook endpoint (no auth required, validated by signature)
    router.post('/webhook', asyncHandler(controller.handleWebhook.bind(controller)));
    return router;
}
