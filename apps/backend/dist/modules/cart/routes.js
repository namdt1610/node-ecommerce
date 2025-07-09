"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModuleRoutes = cartModuleRoutes;
const express_1 = require("express");
const container_1 = require("./container");
const auth_middleware_1 = require("@/common/middlewares/auth.middleware");
function cartModuleRoutes() {
    const router = (0, express_1.Router)();
    const container = (0, container_1.createCartContainer)();
    const controller = container.cartController;
    // All cart routes require authentication
    router.use(auth_middleware_1.authMiddleware);
    router.get('/', controller.getCart.bind(controller));
    router.get('/count', controller.getCartItemsCount.bind(controller));
    router.post('/add', controller.addToCart.bind(controller));
    router.post('/items', controller.addToCart.bind(controller));
    router.put('/items/:itemId', controller.updateCartItem.bind(controller));
    router.delete('/items/:itemId', controller.removeFromCart.bind(controller));
    router.delete('/', controller.clearCart.bind(controller));
    return router;
}
