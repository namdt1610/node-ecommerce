import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ProductService } from './product.service'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import { CreateProductSchema } from './dto/create-product.dto'
import { UpdateProductSchema } from './dto/update-product.dto'

export class ProductController {
    constructor(private productService: ProductService) {}

    async createProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const createProductDto = CreateProductSchema.parse(req.body)
            const product =
                await this.productService.createProduct(createProductDto)
            res.status(201).json({
                success: true,
                product,
                message: 'Product created successfully',
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                })
                return
            }
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

            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found',
                })
                return
            }

            res.json({
                success: true,
                data: product,
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllProducts(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {
                page = '1',
                limit = '10',
                search = '',
                categoryId = '',
            } = req.query

            const skip = (Number(page) - 1) * Number(limit)
            const take = Number(limit)

            const products = await this.productService.getAllProducts({
                skip,
                take,
                search: search as string,
                categoryId: (categoryId as string) || undefined,
            })

            const total = await this.productService.getProductsCount({
                search: search as string,
                categoryId: (categoryId as string) || undefined,
            })

            res.json({
                success: true,
                data: products,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            })
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
            const updateProductDto = UpdateProductSchema.parse(req.body)

            const product = await this.productService.updateProduct(
                id,
                updateProductDto
            )

            res.json({
                success: true,
                data: product,
                message: 'Product updated successfully',
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                })
                return
            }
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

            res.json({
                success: true,
                message: 'Product deleted successfully',
            })
        } catch (error) {
            next(error)
        }
    }
}
