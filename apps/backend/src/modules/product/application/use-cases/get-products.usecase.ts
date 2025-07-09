import { IProductRepository } from '../../domain/interfaces/product-repository.interface'
import { ProductSearchDto, ProductSearchSchema } from '../dto/product.dto'
import { Product } from '../../domain/entities/product.entity'

export class GetProductsUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(searchOptions: ProductSearchDto): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
        page: number
        limit: number
        totalPages: number
    }> {
        // Validate input
        const validatedOptions = ProductSearchSchema.parse(searchOptions)

        try {
            const result = await this.productRepository.search(validatedOptions)

            const totalPages = Math.ceil(result.total / validatedOptions.limit)

            return {
                products: result.products,
                total: result.total,
                hasMore: result.hasMore,
                page: validatedOptions.page,
                limit: validatedOptions.limit,
                totalPages,
            }
        } catch (error) {
            throw new Error(
                'Failed to get products: ' + (error as Error).message
            )
        }
    }

    async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
        try {
            return await this.productRepository.findFeatured(limit)
        } catch (error) {
            throw new Error(
                'Failed to get featured products: ' + (error as Error).message
            )
        }
    }

    async getPopularProducts(limit: number = 10): Promise<Product[]> {
        try {
            return await this.productRepository.findPopular(limit)
        } catch (error) {
            throw new Error(
                'Failed to get popular products: ' + (error as Error).message
            )
        }
    }

    async getRecentProducts(limit: number = 10): Promise<Product[]> {
        try {
            return await this.productRepository.findRecentlyAdded(limit)
        } catch (error) {
            throw new Error(
                'Failed to get recent products: ' + (error as Error).message
            )
        }
    }

    async getProductsOnSale(limit: number = 10): Promise<Product[]> {
        try {
            return await this.productRepository.findOnSale(limit)
        } catch (error) {
            throw new Error(
                'Failed to get products on sale: ' + (error as Error).message
            )
        }
    }

    async getProductsByCategory(
        categoryId: string,
        searchOptions?: ProductSearchDto
    ): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
        page: number
        limit: number
        totalPages: number
    }> {
        try {
            const options = searchOptions
                ? ProductSearchSchema.parse(searchOptions)
                : {
                      page: 1,
                      limit: 20,
                      sortBy: 'createdAt' as const,
                      sortOrder: 'desc' as const,
                  }
            const result = await this.productRepository.findByCategory(
                categoryId,
                options
            )

            const totalPages = Math.ceil(result.total / options.limit)

            return {
                products: result.products,
                total: result.total,
                hasMore: result.hasMore,
                page: options.page,
                limit: options.limit,
                totalPages,
            }
        } catch (error) {
            throw new Error(
                'Failed to get products by category: ' +
                    (error as Error).message
            )
        }
    }

    async getProductsByBrand(
        brand: string,
        searchOptions?: ProductSearchDto
    ): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
        page: number
        limit: number
        totalPages: number
    }> {
        try {
            const options = searchOptions
                ? ProductSearchSchema.parse(searchOptions)
                : {
                      page: 1,
                      limit: 20,
                      sortBy: 'createdAt' as const,
                      sortOrder: 'desc' as const,
                  }
            const result = await this.productRepository.findByBrand(
                brand,
                options
            )

            const totalPages = Math.ceil(result.total / options.limit)

            return {
                products: result.products,
                total: result.total,
                hasMore: result.hasMore,
                page: options.page,
                limit: options.limit,
                totalPages,
            }
        } catch (error) {
            throw new Error(
                'Failed to get products by brand: ' + (error as Error).message
            )
        }
    }

    async getRelatedProducts(
        productId: string,
        limit: number = 5
    ): Promise<Product[]> {
        try {
            return await this.productRepository.findRelatedProducts(
                productId,
                limit
            )
        } catch (error) {
            throw new Error(
                'Failed to get related products: ' + (error as Error).message
            )
        }
    }

    async getSimilarProducts(
        productId: string,
        limit: number = 5
    ): Promise<Product[]> {
        try {
            return await this.productRepository.findSimilarProducts(
                productId,
                limit
            )
        } catch (error) {
            throw new Error(
                'Failed to get similar products: ' + (error as Error).message
            )
        }
    }

    async searchProducts(
        query: string,
        searchOptions?: Partial<ProductSearchDto>
    ): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
        page: number
        limit: number
        totalPages: number
    }> {
        try {
            const options = ProductSearchSchema.parse({
                query,
                page: 1,
                limit: 20,
                sortBy: 'createdAt' as const,
                sortOrder: 'desc' as const,
                ...searchOptions,
            })

            const result = await this.productRepository.search(options)

            const totalPages = Math.ceil(result.total / options.limit)

            return {
                products: result.products,
                total: result.total,
                hasMore: result.hasMore,
                page: options.page,
                limit: options.limit,
                totalPages,
            }
        } catch (error) {
            throw new Error(
                'Failed to search products: ' + (error as Error).message
            )
        }
    }

    async getMinimalProductData(searchOptions: ProductSearchDto): Promise<{
        products: Partial<Product>[]
        total: number
        page: number
        limit: number
        totalPages: number
    }> {
        try {
            const validatedOptions = ProductSearchSchema.parse(searchOptions)
            const result =
                await this.productRepository.findProductsWithMinimalData(
                    validatedOptions
                )

            const totalPages = Math.ceil(result.total / validatedOptions.limit)

            return {
                products: result.products,
                total: result.total,
                page: validatedOptions.page,
                limit: validatedOptions.limit,
                totalPages,
            }
        } catch (error) {
            throw new Error(
                'Failed to get minimal product data: ' +
                    (error as Error).message
            )
        }
    }
}
