import {
    Product,
    CreateProductData,
    UpdateProductData,
    ProductSearchOptions,
    ProductFilters,
} from '../entities/product.entity'
import { ProductDetails } from '../entities/product-details.entity'

export interface IProductRepository {
    // Basic CRUD operations
    create(productData: CreateProductData): Promise<Product>
    findById(id: string): Promise<Product | null>
    findBySlug(slug: string): Promise<Product | null>
    findBySku(sku: string): Promise<Product | null>
    update(id: string, productData: UpdateProductData): Promise<Product>
    delete(id: string): Promise<void>

    // Search and filtering
    search(options: ProductSearchOptions): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
    }>

    findByCategory(
        categoryId: string,
        options?: ProductSearchOptions
    ): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
    }>

    findByBrand(
        brand: string,
        options?: ProductSearchOptions
    ): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
    }>

    findFeatured(limit?: number): Promise<Product[]>
    findPopular(limit?: number): Promise<Product[]>
    findRecentlyAdded(limit?: number): Promise<Product[]>
    findOnSale(limit?: number): Promise<Product[]>

    // Advanced filtering
    findByFilters(
        filters: ProductFilters,
        options?: ProductSearchOptions
    ): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
    }>

    findRelatedProducts(productId: string, limit?: number): Promise<Product[]>
    findSimilarProducts(productId: string, limit?: number): Promise<Product[]>

    // Inventory management
    updateInventory(productId: string, quantity: number): Promise<void>
    reserveQuantity(productId: string, quantity: number): Promise<boolean>
    releaseReservedQuantity(productId: string, quantity: number): Promise<void>

    // Variant operations
    findProductWithVariants(productId: string): Promise<Product | null>
    updateVariantInventory(
        productId: string,
        variantId: string,
        quantity: number
    ): Promise<void>

    // Product details operations
    createProductDetails(
        productId: string,
        details: any
    ): Promise<ProductDetails>
    getProductDetails(productId: string): Promise<ProductDetails | null>
    updateProductDetails(
        productId: string,
        details: any
    ): Promise<ProductDetails>

    // Analytics and reporting
    getProductAnalytics(productId: string): Promise<{
        views: number
        sales: number
        revenue: number
        averageRating: number
        reviewCount: number
    }>

    // Bulk operations
    bulkUpdatePrices(
        updates: { id: string; price: number; originalPrice?: number }[]
    ): Promise<void>
    bulkUpdateStatus(productIds: string[], status: string): Promise<void>

    // Availability checks
    checkAvailability(productId: string, quantity: number): Promise<boolean>
    getAvailableQuantity(productId: string): Promise<number>

    // SEO and optimization
    updateSEO(productId: string, seoData: any): Promise<void>
    generateSlug(name: string): Promise<string>

    // Categories and attributes
    getProductCategories(): Promise<any[]>
    getProductAttributes(categoryId: string): Promise<any[]>
    getFilterableAttributes(): Promise<any[]>

    // Performance optimized queries
    findProductsWithMinimalData(options: ProductSearchOptions): Promise<{
        products: Partial<Product>[]
        total: number
    }>
}
