import { ProductRepository } from './product.repository'
import {
    CreateProductDto,
    UpdateProductDto,
    ProductResponseDto,
} from './product.dto'
import { Product, Category } from '@prisma/client'

type ProductWithCategory = Product & { category: Category }

export class ProductService {
    constructor(private productRepository: ProductRepository) {}

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    async createProduct(
        createProductDto: CreateProductDto
    ): Promise<ProductResponseDto> {
        // Generate slug from name
        const slug = this.generateSlug(createProductDto.name)

        const product = (await this.productRepository.create({
            ...createProductDto,
            slug,
            category: {
                connect: { id: createProductDto.categoryId },
            },
        } as any)) as any

        return this.mapToResponseDto(product)
    }

    async getProductById(id: string): Promise<ProductResponseDto | null> {
        const product = (await this.productRepository.findById(id)) as
            | any
            | null
        if (!product) {
            return null
        }
        return this.mapToResponseDto(product)
    }

    async getAllProducts(params?: {
        skip?: number
        take?: number
        search?: string
        categoryId?: string
    }): Promise<ProductResponseDto[]> {
        const { skip, take, search, categoryId } = params || {}

        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (categoryId) {
            where.categoryId = categoryId
        }

        const products = (await this.productRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        })) as any[]

        return products.map((product) => this.mapToResponseDto(product))
    }

    async updateProduct(
        id: string,
        updateProductDto: UpdateProductDto
    ): Promise<ProductResponseDto> {
        const updateData: any = { ...updateProductDto }

        if (updateProductDto.categoryId) {
            updateData.category = {
                connect: { id: updateProductDto.categoryId },
            }
            delete updateData.categoryId
        }

        const product = (await this.productRepository.update(
            id,
            updateData
        )) as any
        return this.mapToResponseDto(product)
    }

    async deleteProduct(id: string): Promise<void> {
        await this.productRepository.delete(id)
    }

    async getProductsCount(params?: {
        search?: string
        categoryId?: string
    }): Promise<number> {
        const { search, categoryId } = params || {}

        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (categoryId) {
            where.categoryId = categoryId
        }

        return this.productRepository.count(where)
    }

    private mapToResponseDto(product: any): ProductResponseDto {
        // Parse images from JSON
        const images = product.images
            ? JSON.parse(product.images as string)
            : []
        const imageUrl = images.length > 0 ? images[0] : undefined

        // Parse variants from JSON
        const variants = product.variants
            ? JSON.parse(product.variants as string)
            : []

        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description || undefined,
            price: product.price,
            originalPrice: product.originalPrice,
            imageUrl,
            variants,
            category: {
                id: product.category.id,
                name: product.category.name,
            },
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        }
    }
}
