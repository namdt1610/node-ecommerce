"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModuleRoutes = userModuleRoutes;
const express_1 = require("express");
const container_1 = require("./container");
const auth_middleware_1 = require("@/common/middlewares/auth.middleware");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
function userModuleRoutes() {
    const router = (0, express_1.Router)();
    const controller = (0, container_1.createUserController)();
    // Profile routes (require authentication)
    router.get('/profile', auth_middleware_1.authMiddleware, asyncHandler(controller.getProfile.bind(controller)));
    router.put('/profile', auth_middleware_1.authMiddleware, asyncHandler(controller.updateProfile.bind(controller)));
    // Admin routes (require authentication)
    router.get('/', auth_middleware_1.authMiddleware, asyncHandler(controller.getAllUsers.bind(controller)));
    router.delete('/:id', auth_middleware_1.authMiddleware, asyncHandler(controller.deleteUser.bind(controller)));
    return router;
}
