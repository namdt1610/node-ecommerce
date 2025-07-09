"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const product_service_1 = require("./product.service");
const product_repository_1 = require("./product.repository");
const router = (0, express_1.Router)();
// Initialize dependencies
const productRepository = new product_repository_1.ProductRepository();
const productService = new product_service_1.ProductService(productRepository);
const productController = new product_controller_1.ProductController(productService);
// Routes
router.post('/', productController.createProduct.bind(productController));
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.put('/:id', productController.updateProduct.bind(productController));
router.delete('/:id', productController.deleteProduct.bind(productController));
exports.default = router;
