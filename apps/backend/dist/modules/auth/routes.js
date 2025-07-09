"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authModuleRoutes = authModuleRoutes;
const express_1 = require("express");
const container_1 = require("./container");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
function authModuleRoutes() {
    const router = (0, express_1.Router)();
    const controller = (0, container_1.createAuthController)();
    router.post('/register', asyncHandler(controller.register.bind(controller)));
    router.post('/login', asyncHandler(controller.login.bind(controller)));
    router.post('/logout', asyncHandler(controller.logout.bind(controller)));
    return router;
}
