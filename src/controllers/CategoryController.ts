import { Request, Response, NextFunction } from 'express'
import Category from '../models/CategoryModel'

class CategoryController {
    constructor() {
        this.getAllCategories = this.getAllCategories.bind(this)
        this.getCategoryById = this.getCategoryById.bind(this)
        this.createCategory = this.createCategory.bind(this)
        this.updateCategory = this.updateCategory.bind(this)
        this.deleteCategory = this.deleteCategory.bind(this)
    }

    async getAllCategories(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const categories = await Category.find().sort({ name: 1 })
            res.status(200).json(categories)
        } catch (error) {
            next({
                status: 500,
                message: 'Server Error: Unable to get categories',
                error: (error as Error).message,
            })
        }
    }

    async getCategoryById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params
            const category = await Category.findById(id)

            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Category not found',
                })
                return
            }

            res.status(200).json({
                success: true,
                message: 'Category loaded successfully',
                category,
            })
        } catch (error) {
            next({
                status: 500,
                message: 'Server Error: Unable to get category',
                error: (error as Error).message,
            })
        }
    }

    async createCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { name } = req.body

            if (!name) {
                res.status(400).json({
                    success: false,
                    message: 'Category name is required',
                })
                return
            }

            const existingCategory = await Category.findOne({ name })
            if (existingCategory) {
                res.status(400).json({
                    success: false,
                    message: `${name} category already exists`,
                })
                return
            }

            const category = await Category.create({ name })

            res.status(201).json({
                success: true,
                message: 'Category created successfully',
                category,
            })
        } catch (error) {
            if (error instanceof Error && (error as any).code === 11000) {
                res.status(400).json({
                    success: false,
                    message: 'Duplicate key error',
                })
                return
            }

            next({
                status: 500,
                message: (error as Error).message,
            })
        }
    }

    async updateCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { name, isActive, productsCount } = req.body

            if (!name) {
                res.status(400).json({
                    success: false,
                    message: 'Category name is required',
                })
                return
            }

            const category = await Category.findById(req.params.id)
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: `Category with ID ${req.params.id} not found`,
                })
                return
            }

            category.name = name
            category.isActive = isActive
            category.productsCount = productsCount

            await category.save()

            res.status(200).json({
                success: true,
                message: 'Category updated successfully',
                category,
            })
        } catch (error) {
            next({
                status: 500,
                message:
                    (error as Error).message ||
                    'An error occurred while updating the category',
            })
        }
    }

    async deleteCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const category = await Category.findById(req.params.id)

            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Category not found',
                })
                return
            }

            await Category.deleteOne({ _id: req.params.id })
            res.status(200).json({
                success: true,
                message: 'Category deleted successfully',
            })
        } catch (error) {
            next({
                status: 500,
                message: (error as Error).message,
            })
        }
    }
}

export default new CategoryController()
