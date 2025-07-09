"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModuleRoutes = productModuleRoutes;
const express_1 = require("express");
const container_1 = require("./container");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
function productModuleRoutes() {
    const router = (0, express_1.Router)();
    const controller = (0, container_1.createProductController)();
    router.get('/', asyncHandler(controller.getAllProducts.bind(controller)));
    router.get('/search', asyncHandler(controller.searchProducts.bind(controller)));
    router.get('/:id', asyncHandler(controller.getProductById.bind(controller)));
    router.post('/', asyncHandler(controller.createProduct.bind(controller)));
    router.put('/:id', asyncHandler(controller.updateProduct.bind(controller)));
    router.delete('/:id', asyncHandler(controller.deleteProduct.bind(controller)));
    return router;
}
