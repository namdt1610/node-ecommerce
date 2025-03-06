import { Request, Response } from 'express'
import Category from '../models/CategoryModel'

const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find().sort({ name: 1 })
        // console.log('Categories:', categories)
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to get categories',
            error: (error as Error).message,
        })
    }
}

const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params

        const category = await Category.findById(id)
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Category loaded successfully',
            category,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to get category',
            error: (error as Error).message,
        })
    }
}

const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Category name is required',
            })
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            res.status(400).json({
                success: false,
                message: `${name} category already exists`,
            })
        }

        const category = await Category.create({ name })

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof Error && (error as any).code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Duplicate key error',
            })
        }

        res.status(500).json({
            success: false,
            message: (error as Error).message,
        })
    }
}

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id)

        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found',
            })
        }

        await Category.deleteOne({ _id: req.params.id })
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message,
        })
    }
}

const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, isActive, productsCount } = req.body
        console.log('Request body:', req.body)

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
        console.error('Error updating category:', error)
        res.status(500).json({
            success: false,
            message:
                (error as Error).message ||
                'An error occurred while updating the category.',
        })
    }
}

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory,
    updateCategory,
}
