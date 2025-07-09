"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const user_repository_1 = require("./user.repository");
const auth_middleware_1 = require("@/common/middlewares/auth.middleware");
const router = (0, express_1.Router)();
const userRepository = new user_repository_1.UserRepository();
const userService = new user_service_1.UserService(userRepository);
const userController = new user_controller_1.UserController(userService);
// Profile routes (require authentication)
router.get('/profile', auth_middleware_1.authMiddleware, userController.getProfile.bind(userController));
router.put('/profile', auth_middleware_1.authMiddleware, userController.updateProfile.bind(userController));
// Standard CRUD routes
router.post('/', userController.createUser.bind(userController));
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
exports.default = router;
