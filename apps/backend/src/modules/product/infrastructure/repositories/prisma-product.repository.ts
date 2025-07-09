import { PrismaClient } from '@prisma/client'
import { IProductRepository } from '../../domain/interfaces/product-repository.interface'
import {
    Product,
    CreateProductData,
    UpdateProductData,
    ProductSearchOptions,
    ProductFilters,
    ProductType,
    ProductStatus,
} from '../../domain/entities/product.entity'
import { ProductDetails } from '../../domain/entities/product-details.entity'

export class PrismaProductRepository implements IProductRepository {
    constructor(private prisma: PrismaClient) {}

    async create(productData: CreateProductData): Promise<Product> {
        const slug = await this.generateSlug(productData.name)

        const product = await this.prisma.product.create({
            data: {
                name: productData.name,
                slug,
                brand: productData.brand,
                model: productData.model,
                sku: productData.sku,
                description: productData.description,
                shortDescription: productData.shortDescription,
                price: productData.price,
                originalPrice: productData.originalPrice,
                discount:
                    productData.originalPrice > productData.price
                        ? ((productData.originalPrice - productData.price) /
                              productData.originalPrice) *
                          100
                        : 0,
                currency: 'USD',
                categoryId: productData.categoryId,
                subCategoryId: productData.subCategoryId,
                productType: productData.productType,
                condition: productData.condition || 'NEW',
                status: 'ACTIVE',
                images: productData.images as any,
                attributes: productData.attributes as any,
                specifications: productData.specifications as any,
                variants: productData.variants as any,
                inventory: productData.inventory as any,
                seo: productData.seo as any,
                tags: productData.tags || [],
                isActive: true,
                isFeatured: false,
                isDigital: false,
                weight: productData.weight,
                dimensions: productData.dimensions as any,
                ratings: {
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                } as any,
            },
            include: {
                category: true,
            },
        })

        return this.mapPrismaToProduct(product)
    }

    async findById(id: string): Promise<Product | null> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        })

        return product ? this.mapPrismaToProduct(product) : null
    }

    async findBySlug(slug: string): Promise<Product | null> {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
            },
        })

        return product ? this.mapPrismaToProduct(product) : null
    }

    async findBySku(sku: string): Promise<Product | null> {
        const product = await this.prisma.product.findUnique({
            where: { sku },
            include: {
                category: true,
            },
        })

        return product ? this.mapPrismaToProduct(product) : null
    }

    async update(id: string, productData: UpdateProductData): Promise<Product> {
        const updateData: any = { ...productData }

        if (productData.name) {
            updateData.slug = await this.generateSlug(productData.name)
        }

        if (productData.price && productData.originalPrice) {
            updateData.discount =
                productData.originalPrice > productData.price
                    ? ((productData.originalPrice - productData.price) /
                          productData.originalPrice) *
                      100
                    : 0
        }

        const product = await this.prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
            },
        })

        return this.mapPrismaToProduct(product)
    }

    async delete(id: string): Promise<void> {
        await this.prisma.product.delete({
            where: { id },
        })
    }

    async search(options: ProductSearchOptions): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
    }> {
        const {
            query,
            filters,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = options
        const skip = (page - 1) * limit

        const where: any = {
            isActive: true,
        }

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { brand: { contains: query, mode: 'insensitive' } },
                { model: { contains: query, mode: 'insensitive' } },
                { tags: { has: query } },
            ]
        }

        if (filters) {
            this.applyFiltersToWhere(where, filters)
        }

        const orderBy = this.buildOrderBy(sortBy, sortOrder)

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: true,
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ])

        return {
            products: products.map((p) => this.mapPrismaToProduct(p)),
            total,
            hasMore: skip + products.length < total,
        }
    }

    async findByCategory(
        categoryId: string,
        options?: ProductSearchOptions
    ): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
    }> {
        const searchOptions: ProductSearchOptions = {
            page: 1,
            limit: 20,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            ...options,
            filters: { ...options?.filters, categoryId },
        }
        return this.search(searchOptions)
    }

    async findByBrand(
        brand: string,
        options?: ProductSearchOptions
    ): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
    }> {
        const searchOptions: ProductSearchOptions = {
            page: 1,
            limit: 20,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            ...options,
            filters: { ...options?.filters, brand: [brand] },
        }
        return this.search(searchOptions)
    }

    async findFeatured(limit: number = 10): Promise<Product[]> {
        const products = await this.prisma.product.findMany({
            where: {
                isActive: true,
                isFeatured: true,
            },
            include: {
                category: true,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
        })

        return products.map((p) => this.mapPrismaToProduct(p))
    }

    async findPopular(limit: number = 10): Promise<Product[]> {
        const products = await this.prisma.product.findMany({
            where: {
                isActive: true,
            },
            include: {
                category: true,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
        })

        return products.map((p) => this.mapPrismaToProduct(p))
    }

    async findRecentlyAdded(limit: number = 10): Promise<Product[]> {
        const products = await this.prisma.product.findMany({
            where: {
                isActive: true,
            },
            include: {
                category: true,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
        })

        return products.map((p) => this.mapPrismaToProduct(p))
    }

    async findOnSale(limit: number = 10): Promise<Product[]> {
        const products = await this.prisma.product.findMany({
            where: {
                isActive: true,
                discount: { gt: 0 },
            },
            include: {
                category: true,
            },
            take: limit,
            orderBy: { discount: 'desc' },
        })

        return products.map((p) => this.mapPrismaToProduct(p))
    }

    async findByFilters(
        filters: ProductFilters,
        options?: ProductSearchOptions
    ): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
    }> {
        const searchOptions: ProductSearchOptions = {
            page: 1,
            limit: 20,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            ...options,
            filters,
        }
        return this.search(searchOptions)
    }

    async findRelatedProducts(
        productId: string,
        limit: number = 5
    ): Promise<Product[]> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) return []

        const products = await this.prisma.product.findMany({
            where: {
                isActive: true,
                id: { not: productId },
                OR: [
                    { categoryId: product.categoryId },
                    { brand: product.brand },
                    { productType: product.productType as any },
                ],
            },
            include: {
                category: true,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
        })

        return products.map((p) => this.mapPrismaToProduct(p))
    }

    async findSimilarProducts(
        productId: string,
        limit: number = 5
    ): Promise<Product[]> {
        return this.findRelatedProducts(productId, limit)
    }

    async updateInventory(productId: string, quantity: number): Promise<void> {
        await this.prisma.product.update({
            where: { id: productId },
            data: {
                inventory: {
                    update: {
                        totalQuantity: quantity,
                        availableQuantity: quantity,
                    },
                },
            },
        })
    }

    async reserveQuantity(
        productId: string,
        quantity: number
    ): Promise<boolean> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) return false

        const inventory = product.inventory as any
        if (inventory.availableQuantity < quantity) return false

        await this.prisma.product.update({
            where: { id: productId },
            data: {
                inventory: {
                    ...inventory,
                    reservedQuantity: inventory.reservedQuantity + quantity,
                    availableQuantity: inventory.availableQuantity - quantity,
                },
            },
        })

        return true
    }

    async releaseReservedQuantity(
        productId: string,
        quantity: number
    ): Promise<void> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) return

        const inventory = product.inventory as any

        await this.prisma.product.update({
            where: { id: productId },
            data: {
                inventory: {
                    ...inventory,
                    reservedQuantity: Math.max(
                        0,
                        inventory.reservedQuantity - quantity
                    ),
                    availableQuantity: inventory.availableQuantity + quantity,
                },
            },
        })
    }

    async findProductWithVariants(productId: string): Promise<Product | null> {
        return this.findById(productId)
    }

    async updateVariantInventory(
        productId: string,
        variantId: string,
        quantity: number
    ): Promise<void> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) return

        const variants = product.variants as any[]
        const variantIndex = variants.findIndex((v) => v.id === variantId)

        if (variantIndex !== -1) {
            variants[variantIndex].inventory.quantity = quantity
            variants[variantIndex].inventory.availableQuantity = quantity

            await this.prisma.product.update({
                where: { id: productId },
                data: { variants },
            })
        }
    }

    async createProductDetails(
        productId: string,
        details: any
    ): Promise<ProductDetails> {
        // This would require a separate ProductDetails table in the database
        // For now, we'll store it as JSON in the product table or create a separate implementation
        throw new Error('Not implemented - requires ProductDetails table')
    }

    async getProductDetails(productId: string): Promise<ProductDetails | null> {
        throw new Error('Not implemented - requires ProductDetails table')
    }

    async updateProductDetails(
        productId: string,
        details: any
    ): Promise<ProductDetails> {
        throw new Error('Not implemented - requires ProductDetails table')
    }

    async getProductAnalytics(productId: string): Promise<{
        views: number
        sales: number
        revenue: number
        averageRating: number
        reviewCount: number
    }> {
        // This would require analytics tracking implementation
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) {
            throw new Error('Product not found')
        }

        const ratings = product.ratings as any

        return {
            views: 0, // Would come from analytics
            sales: 0, // Would come from order analytics
            revenue: 0, // Would come from order analytics
            averageRating: ratings?.averageRating || 0,
            reviewCount: ratings?.totalReviews || 0,
        }
    }

    async bulkUpdatePrices(
        updates: { id: string; price: number; originalPrice?: number }[]
    ): Promise<void> {
        const promises = updates.map((update) => {
            const discount =
                update.originalPrice && update.originalPrice > update.price
                    ? ((update.originalPrice - update.price) /
                          update.originalPrice) *
                      100
                    : 0

            return this.prisma.product.update({
                where: { id: update.id },
                data: {
                    price: update.price,
                    originalPrice: update.originalPrice,
                    discount,
                },
            })
        })

        await Promise.all(promises)
    }

    async bulkUpdateStatus(
        productIds: string[],
        status: ProductStatus
    ): Promise<void> {
        await this.prisma.product.updateMany({
            where: {
                id: { in: productIds },
            },
            data: { status },
        })
    }

    async checkAvailability(
        productId: string,
        quantity: number
    ): Promise<boolean> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) return false

        const inventory = product.inventory as any
        return inventory.availableQuantity >= quantity
    }

    async getAvailableQuantity(productId: string): Promise<number> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product) return 0

        const inventory = product.inventory as any
        return inventory.availableQuantity || 0
    }

    async updateSEO(productId: string, seoData: any): Promise<void> {
        await this.prisma.product.update({
            where: { id: productId },
            data: { seo: seoData },
        })
    }

    async generateSlug(name: string): Promise<string> {
        const baseSlug = name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()

        let slug = baseSlug
        let counter = 1

        while (await this.prisma.product.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        return slug
    }

    async getProductCategories(): Promise<any[]> {
        return this.prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        })
    }

    async getProductAttributes(categoryId: string): Promise<any[]> {
        // This would require a proper attribute system
        return []
    }

    async getFilterableAttributes(): Promise<any[]> {
        // This would return all filterable attributes across categories
        return []
    }

    async findProductsWithMinimalData(options: ProductSearchOptions): Promise<{
        products: Partial<Product>[]
        total: number
    }> {
        const {
            query,
            filters,
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = options
        const skip = (page - 1) * limit

        const where: any = { isActive: true }

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { brand: { contains: query, mode: 'insensitive' } },
            ]
        }

        if (filters) {
            this.applyFiltersToWhere(where, filters)
        }

        const orderBy = this.buildOrderBy(sortBy, sortOrder)

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    brand: true,
                    price: true,
                    originalPrice: true,
                    discount: true,
                    images: true,
                    ratings: true,
                    isActive: true,
                    isFeatured: true,
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ])

        return {
            products: products.map((product) => ({
                ...product,
                brand: product.brand || undefined,
                originalPrice: product.originalPrice || undefined,
                discount: product.discount || undefined,
                images: (product.images as any) || [],
                ratings: (product.ratings as any) || {
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                },
            })),
            total,
        }
    }

    // Helper methods
    private applyFiltersToWhere(where: any, filters: ProductFilters): void {
        if (filters.categoryId) {
            where.categoryId = filters.categoryId
        }

        if (filters.subCategoryId) {
            where.subCategoryId = filters.subCategoryId
        }

        if (filters.brand && filters.brand.length > 0) {
            where.brand = { in: filters.brand }
        }

        if (filters.productType && filters.productType.length > 0) {
            where.productType = { in: filters.productType }
        }

        if (filters.condition && filters.condition.length > 0) {
            where.condition = { in: filters.condition }
        }

        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
            where.price = {}
            if (filters.priceMin !== undefined) {
                where.price.gte = filters.priceMin
            }
            if (filters.priceMax !== undefined) {
                where.price.lte = filters.priceMax
            }
        }

        if (filters.rating !== undefined) {
            where.ratings = {
                path: ['averageRating'],
                gte: filters.rating,
            }
        }

        if (filters.inStock) {
            where.inventory = {
                path: ['availableQuantity'],
                gt: 0,
            }
        }

        if (filters.isFeatured !== undefined) {
            where.isFeatured = filters.isFeatured
        }

        if (filters.tags && filters.tags.length > 0) {
            where.tags = {
                hasSome: filters.tags,
            }
        }
    }

    private buildOrderBy(sortBy: string, sortOrder: string): any {
        switch (sortBy) {
            case 'name':
                return { name: sortOrder }
            case 'price':
                return { price: sortOrder }
            case 'rating':
                return {
                    ratings: { path: ['averageRating'], order: sortOrder },
                }
            case 'popularity':
                return { ratings: { path: ['totalReviews'], order: sortOrder } }
            case 'discount':
                return { discount: sortOrder }
            default:
                return { createdAt: sortOrder }
        }
    }

    private mapPrismaToProduct(prismaProduct: any): Product {
        return {
            id: prismaProduct.id,
            name: prismaProduct.name,
            slug: prismaProduct.slug,
            brand: prismaProduct.brand,
            model: prismaProduct.model,
            sku: prismaProduct.sku,
            description: prismaProduct.description,
            shortDescription: prismaProduct.shortDescription,
            price: prismaProduct.price,
            originalPrice: prismaProduct.originalPrice,
            discount: prismaProduct.discount,
            currency: prismaProduct.currency,
            categoryId: prismaProduct.categoryId,
            category: prismaProduct.category,
            subCategoryId: prismaProduct.subCategoryId,
            subCategory: prismaProduct.subCategory,
            productType: prismaProduct.productType as ProductType,
            condition: prismaProduct.condition,
            status: prismaProduct.status,
            images: prismaProduct.images || [],
            videos: prismaProduct.videos || [],
            attributes: prismaProduct.attributes || [],
            specifications: prismaProduct.specifications || [],
            variants: prismaProduct.variants || [],
            inventory: prismaProduct.inventory,
            seo: prismaProduct.seo || {},
            ratings: prismaProduct.ratings || {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            },
            tags: prismaProduct.tags || [],
            isActive: prismaProduct.isActive,
            isFeatured: prismaProduct.isFeatured,
            isDigital: prismaProduct.isDigital,
            weight: prismaProduct.weight,
            dimensions: prismaProduct.dimensions,
            shippingInfo: prismaProduct.shippingInfo,
            createdAt: prismaProduct.createdAt,
            updatedAt: prismaProduct.updatedAt,
        }
    }
}
