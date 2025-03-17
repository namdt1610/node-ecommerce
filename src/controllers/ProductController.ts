// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\controllers\ProductController.ts
import { NextFunction, Request, Response } from 'express'
import { ProductService } from '@/services/ProductService'

class ProductController {
    private productService: ProductService

    constructor() {
        this.productService = new ProductService()
        this.getAllProducts = this.getAllProducts.bind(this)
        this.getActiveProducts = this.getActiveProducts.bind(this)
        this.getProductById = this.getProductById.bind(this)
        this.createProduct = this.createProduct.bind(this)
        this.updateProduct = this.updateProduct.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
        this.updateClickCount = this.updateClickCount.bind(this)
    }

    async getAllProducts(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const products = await this.productService.getProducts()
            res.status(200).json(products)
        } catch (error) {
            next(error)
        }
    }

    async getActiveProducts(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const products = await this.productService.getActiveProducts()
            res.status(200).json(products)
        } catch (error) {
            next(error)
        }
    }

    async getProductById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params
            const product = await this.productService.getProductById(id)
            res.status(200).json(product)
        } catch (error) {
            next(error)
        }
    }

    async createProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const productData = req.body
            if (req.body?.filename) {
                productData.images = [`/uploads${req.body.filename}`]
            }
            const product = await this.productService.createProduct(productData)
            res.status(201).json(product)
        } catch (error) {
            next(error)
        }
    }

    async updateProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params
            const productData = req.body
            const product = await this.productService.updateProduct(
                id,
                productData
            )
            res.status(200).json(product)
        } catch (error) {
            next(error)
        }
    }

    async deleteProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params
            await this.productService.deleteProduct(id)
            res.status(200).json({ message: 'Product deleted successfully' })
        } catch (error) {
            next(error)
        }
    }

    async updateClickCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params
            // First fetch the current product
            const currentProduct = await this.productService.getProductById(id)
            // Then update with the incremented click count
            const product = await this.productService.updateProduct(id, {
                clickCount: (currentProduct.clickCount || 0) + 1,
            })
            res.status(200).json(product)
        } catch (error) {
            next(error)
        }
    }
}

export default new ProductController()
