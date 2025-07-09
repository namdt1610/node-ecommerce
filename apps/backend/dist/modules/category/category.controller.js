"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const zod_1 = require("zod");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async createCategory(req, res, next) {
        try {
            const createCategoryDto = create_category_dto_1.CreateCategorySchema.parse(req.body);
            const category = await this.categoryService.createCategory(createCategoryDto);
            res.status(201).json({
                success: true,
                data: category,
                message: 'Category created successfully',
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
    async getCategoryById(req, res, next) {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategoryById(id);
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
                return;
            }
            res.json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllCategories(req, res, next) {
        try {
            const { page = '1', limit = '10', search = '' } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const take = Number(limit);
            const categories = await this.categoryService.getAllCategories({
                skip,
                take,
                search: search,
            });
            const total = await this.categoryService.getCategoriesCount(search);
            res.json({
                success: true,
                data: categories,
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
    async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const updateCategoryDto = update_category_dto_1.UpdateCategorySchema.parse(req.body);
            const category = await this.categoryService.updateCategory(id, updateCategoryDto);
            res.json({
                success: true,
                data: category,
                message: 'Category updated successfully',
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
    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            await this.categoryService.deleteCategory(id);
            res.json({
                success: true,
                message: 'Category deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
