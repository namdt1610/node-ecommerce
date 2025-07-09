"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const category_service_1 = require("./category.service");
const category_repository_1 = require("./category.repository");
const router = (0, express_1.Router)();
// Initialize dependencies
const categoryRepository = new category_repository_1.CategoryRepository();
const categoryService = new category_service_1.CategoryService(categoryRepository);
const categoryController = new category_controller_1.CategoryController(categoryService);
// Routes
router.post('/', categoryController.createCategory.bind(categoryController));
router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));
router.put('/:id', categoryController.updateCategory.bind(categoryController));
router.delete('/:id', categoryController.deleteCategory.bind(categoryController));
exports.default = router;
