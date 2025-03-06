import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Product from '../models/ProductModel'

// GET all products
const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find({}).sort({ name: 1 })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({
            message: 'Server Error: Unable to get products',
            error: (error as Error).message,
        })
    }
}

// GET active products (for client)
export const getActiveProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const products = await Product.find({ isActive: true }).sort({
            name: 1,
        })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({
            message: 'Server Error: Unable to get products',
            error: (error as Error).message,
        })
    }
}

// GET a product by id
const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'Invalid product id' })
        return
    }
    const product = await Product.findById(id).populate('category')

    if (!product) {
        res.status(404).json({ message: `Product with id ${id} not found` })
        return
    }

    res.status(200).json(product)
}

// POST a product
const createProduct = async (req: Request, res: Response): Promise<void> => {
    const { name, category, description, price } = req.body
    const imageUrl = req.body?.filename ? `/uploads${req.body.filename}` : null

    // Kiểm tra sản phẩm đã tồn tại
    if (await Product.findOne({ name })) {
        res.status(400).json({
            message: 'Validation error',
            errors: { name: 'Product already exists' },
        })
        return
    }

    // Kiểm tra các trường bị thiếu
    let errors: Record<string, string> = {}
    if (!name) errors.name = 'Name is required'
    if (!category) errors.category = 'Category is required'
    if (!description) errors.description = 'Description is required'
    if (!price) errors.price = 'Price is required'

    if (Object.keys(errors).length > 0) {
        res.status(400).json({
            message: 'Validation error',
            errors,
        })
        return
    }

    // Tạo sản phẩm mới
    try {
        const product = await Product.create({
            name,
            category,
            description,
            price,
            imageUrl,
        })
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            errors: { general: (error as Error).message },
        })
    }
}

// DELETE a product by id
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid product id' })
        return
    }

    const product = await Product.findOneAndDelete({ _id: id })

    if (!product) {
        res.status(400).json({ error: `Product with id ${id} not found` })
        return
    }

    res.status(200).json(product)
}

// UPDATE a product by id
const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        console.log('id', id)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('Invalid product id')
            res.status(404).json({ error: 'Invalid product id' })
            return
        }

        const product = await Product.findOneAndUpdate(
            { _id: id },
            {
                ...req.body,
            },
            { new: true }
        )

        if (!product) {
            res.status(400).json({ error: `Product with id ${id} not found` })
            return
        }

        res.status(200).json(product)
    } catch (error: any) {
        console.error(error)
        res.status(500).json({
            message: 'Failed to update product',
            error: error.message,
        })
    }
}

// Update click count
export const updateClickCount = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ error: 'Invalid product id' })
        return
    }

    const product = await Product.findById(id)

    if (!product) {
        res.status(404).json({ error: `Product with id ${id} not found` })
        return
    }

    product.clickCount += 1
    await product.save()

    res.status(200).json(product)
}

export {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct,
}
