"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const zod_1 = require("zod");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async createProduct(req, res, next) {
        try {
            const createProductDto = create_product_dto_1.CreateProductSchema.parse(req.body);
            const product = await this.productService.createProduct(createProductDto);
            res.status(201).json({
                success: true,
                product,
                message: 'Product created successfully',
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            next(error);
        }
    }
    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(id);
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
                return;
            }
            res.json({
                success: true,
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllProducts(req, res, next) {
        try {
            const { page = '1', limit = '10', search = '', categoryId = '', } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const take = Number(limit);
            const products = await this.productService.getAllProducts({
                skip,
                take,
                search: search,
                categoryId: categoryId || undefined,
            });
            const total = await this.productService.getProductsCount({
                search: search,
                categoryId: categoryId || undefined,
            });
            res.json({
                success: true,
                data: products,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const updateProductDto = update_product_dto_1.UpdateProductSchema.parse(req.body);
            const product = await this.productService.updateProduct(id, updateProductDto);
            res.json({
                success: true,
                data: product,
                message: 'Product updated successfully',
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            next(error);
        }
    }
    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            await this.productService.deleteProduct(id);
            res.json({
                success: true,
                message: 'Product deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
