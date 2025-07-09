import { Request, Response } from 'express'
import { CreateProductUseCase } from '../../application/use-cases/create-product.usecase'
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.usecase'
import { GetAllProductsUseCase } from '../../application/use-cases/get-all-products.usecase'
import { GetProductsCountUseCase } from '../../application/use-cases/get-products-count.use-case'
import { UpdateProductUseCase } from '../../application/use-cases/update-product.usecase'
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.usecase'
import { SearchProductsUseCase } from '../../application/use-cases/search-products.usecase'

export class ProductController {
    constructor(
        private createProductUseCase: CreateProductUseCase,
        private getProductByIdUseCase: GetProductByIdUseCase,
        private getAllProductsUseCase: GetAllProductsUseCase,
        private getProductsCountUseCase: GetProductsCountUseCase,
        private updateProductUseCase: UpdateProductUseCase,
        private deleteProductUseCase: DeleteProductUseCase,
        private searchProductsUseCase: SearchProductsUseCase
    ) {}

    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const product = await this.createProductUseCase.execute(req.body)
            res.status(201).json({ success: true, data: product })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const product = await this.getProductByIdUseCase.execute(id)
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found',
                })
                return
            }
            res.json({ success: true, data: product })
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message })
        }
    }

    async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const { page = '1', limit = '10', search, categoryId } = req.query
            const skip =
                (parseInt(page as string) - 1) * parseInt(limit as string)
            const take = parseInt(limit as string)

            const products = await this.getAllProductsUseCase.execute({
                skip,
                take,
                search: search as string,
                categoryId: categoryId as string,
            })

            // Get total count for pagination using the dedicated use case
            const totalCount = await this.getProductsCountUseCase.execute(
                search as string,
                categoryId as string
            )

            res.json({
                success: true,
                data: products,
                meta: {
                    total: totalCount,
                    page: parseInt(page as string),
                    limit: take,
                },
            })
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message })
        }
    }

    async searchProducts(req: Request, res: Response): Promise<void> {
        try {
            const searchOptions = req.query as any
            const result =
                await this.searchProductsUseCase.execute(searchOptions)

            res.json({
                success: true,
                data: result.products,
                meta: {
                    total: result.total,
                    hasMore: result.hasMore,
                },
            })
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message })
        }
    }

    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const product = await this.updateProductUseCase.execute(
                id,
                req.body
            )
            res.json({ success: true, data: product })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            await this.deleteProductUseCase.execute(id)
            res.json({ success: true, message: 'Product deleted successfully' })
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message })
        }
    }
}
