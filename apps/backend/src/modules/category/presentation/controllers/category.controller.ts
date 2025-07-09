import { Request, Response } from 'express'
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case'
import { GetCategoryByIdUseCase } from '../../application/use-cases/get-category-by-id.use-case'
import { GetAllCategoriesUseCase } from '../../application/use-cases/get-all-categories.use-case'
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case'
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case'
import { GetCategoriesCountUseCase } from '../../application/use-cases/get-categories-count.use-case'

export class CategoryController {
    constructor(
        private createCategoryUseCase: CreateCategoryUseCase,
        private getCategoryByIdUseCase: GetCategoryByIdUseCase,
        private getAllCategoriesUseCase: GetAllCategoriesUseCase,
        private updateCategoryUseCase: UpdateCategoryUseCase,
        private deleteCategoryUseCase: DeleteCategoryUseCase,
        private getCategoriesCountUseCase: GetCategoriesCountUseCase
    ) {}

    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const category = await this.createCategoryUseCase.execute(req.body)
            res.status(201).json({
                success: true,
                data: category,
                message: 'Category created successfully',
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            })
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const category = await this.getCategoryByIdUseCase.execute(id)

            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Category not found',
                })
                return
            }

            res.json({
                success: true,
                data: category,
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const { page = '1', limit = '10', search } = req.query
            const skip =
                (parseInt(page as string) - 1) * parseInt(limit as string)
            const take = parseInt(limit as string)

            const categories = await this.getAllCategoriesUseCase.execute({
                skip,
                take,
                search: search as string,
            })

            const total = await this.getCategoriesCountUseCase.execute(
                search as string
            )

            res.json({
                success: true,
                data: categories,
                meta: {
                    total,
                    page: parseInt(page as string),
                    limit: take,
                    totalPages: Math.ceil(total / take),
                },
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const category = await this.updateCategoryUseCase.execute(
                id,
                req.body
            )

            res.json({
                success: true,
                data: category,
                message: 'Category updated successfully',
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            })
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            await this.deleteCategoryUseCase.execute(id)

            res.json({
                success: true,
                message: 'Category deleted successfully',
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
}
