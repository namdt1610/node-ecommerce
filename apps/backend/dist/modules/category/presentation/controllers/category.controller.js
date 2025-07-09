"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
class CategoryController {
    createCategoryUseCase;
    getCategoryByIdUseCase;
    getAllCategoriesUseCase;
    updateCategoryUseCase;
    deleteCategoryUseCase;
    getCategoriesCountUseCase;
    constructor(createCategoryUseCase, getCategoryByIdUseCase, getAllCategoriesUseCase, updateCategoryUseCase, deleteCategoryUseCase, getCategoriesCountUseCase) {
        this.createCategoryUseCase = createCategoryUseCase;
        this.getCategoryByIdUseCase = getCategoryByIdUseCase;
        this.getAllCategoriesUseCase = getAllCategoriesUseCase;
        this.updateCategoryUseCase = updateCategoryUseCase;
        this.deleteCategoryUseCase = deleteCategoryUseCase;
        this.getCategoriesCountUseCase = getCategoriesCountUseCase;
    }
    async createCategory(req, res) {
        try {
            const category = await this.createCategoryUseCase.execute(req.body);
            res.status(201).json({
                success: true,
                data: category,
                message: 'Category created successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await this.getCategoryByIdUseCase.execute(id);
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
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getAllCategories(req, res) {
        try {
            const { page = '1', limit = '10', search } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const take = parseInt(limit);
            const categories = await this.getAllCategoriesUseCase.execute({
                skip,
                take,
                search: search,
            });
            const total = await this.getCategoriesCountUseCase.execute(search);
            res.json({
                success: true,
                data: categories,
                meta: {
                    total,
                    page: parseInt(page),
                    limit: take,
                    totalPages: Math.ceil(total / take),
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await this.updateCategoryUseCase.execute(id, req.body);
            res.json({
                success: true,
                data: category,
                message: 'Category updated successfully',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await this.deleteCategoryUseCase.execute(id);
            res.json({
                success: true,
                message: 'Category deleted successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.CategoryController = CategoryController;
