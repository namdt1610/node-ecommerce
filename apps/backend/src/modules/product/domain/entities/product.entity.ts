export interface Product {
    id: string
    name: string
    slug: string
    brand: string
    model: string
    sku: string
    description: string
    shortDescription?: string
    price: number
    originalPrice: number
    discount?: number
    currency: string
    categoryId: string
    category?: ProductCategory
    subCategoryId?: string
    subCategory?: ProductSubCategory
    productType: ProductType
    condition: ProductCondition
    status: ProductStatus
    images: ProductImage[]
    videos?: ProductVideo[]
    attributes: ProductAttribute[]
    specifications: ProductSpecification[]
    variants: ProductVariant[]
    inventory: ProductInventory
    seo: ProductSEO
    ratings: ProductRatings
    tags: string[]
    isActive: boolean
    isFeatured: boolean
    isDigital: boolean
    weight?: number
    dimensions?: ProductDimensions
    shippingInfo?: ProductShippingInfo
    createdAt: Date
    updatedAt: Date
}

export interface ProductCategory {
    id: string
    name: string
    slug: string
    icon?: string
    description?: string
}

export interface ProductSubCategory {
    id: string
    name: string
    slug: string
    categoryId: string
}

export enum ProductType {
    SMARTPHONE = 'SMARTPHONE',
    LAPTOP = 'LAPTOP',
    TABLET = 'TABLET',
    ACCESSORIES = 'ACCESSORIES',
    AUDIO = 'AUDIO',
    WEARABLE = 'WEARABLE',
    GAMING = 'GAMING',
    SOFTWARE = 'SOFTWARE',
    SERVICES = 'SERVICES',
}

export enum ProductCondition {
    NEW = 'NEW',
    LIKE_NEW = 'LIKE_NEW',
    GOOD = 'GOOD',
    FAIR = 'FAIR',
    REFURBISHED = 'REFURBISHED',
}

export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    DISCONTINUED = 'DISCONTINUED',
    COMING_SOON = 'COMING_SOON',
}

export interface ProductImage {
    id: string
    url: string
    alt: string
    position: number
    isPrimary: boolean
    variants?: string[] // Which variants this image applies to
}

export interface ProductVideo {
    id: string
    url: string
    title: string
    thumbnail: string
    duration?: number
    position: number
}

export interface ProductAttribute {
    id: string
    name: string
    value: string
    type: AttributeType
    isFilterable: boolean
    isRequired: boolean
    displayOrder: number
}

export enum AttributeType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    SELECT = 'SELECT',
    MULTI_SELECT = 'MULTI_SELECT',
    COLOR = 'COLOR',
    SIZE = 'SIZE',
    BOOLEAN = 'BOOLEAN',
}

export interface ProductSpecification {
    id: string
    category: string // "Display", "Performance", "Camera", etc.
    name: string
    value: string
    unit?: string
    displayOrder: number
}

export interface ProductVariant {
    id: string
    name: string
    sku: string
    price?: number // If different from base price
    originalPrice?: number
    attributes: VariantAttribute[]
    images?: string[] // Specific images for this variant
    inventory: VariantInventory
    isActive: boolean
}

export interface VariantAttribute {
    name: string // "Color", "Storage", "Size"
    value: string // "Space Black", "256GB", "Large"
}

export interface VariantInventory {
    quantity: number
    reservedQuantity: number
    availableQuantity: number
    lowStockThreshold: number
}

export interface ProductInventory {
    totalQuantity: number
    reservedQuantity: number
    availableQuantity: number
    lowStockThreshold: number
    trackQuantity: boolean
    allowBackorder: boolean
    backorderLimit?: number
}

export interface ProductDimensions {
    length: number
    width: number
    height: number
    unit: 'cm' | 'inch'
}

export interface ProductShippingInfo {
    weight: number
    weightUnit: 'kg' | 'lb'
    dimensions: ProductDimensions
    shippingClass?: string
    freeShipping: boolean
    shippingCost?: number
}

export interface ProductSEO {
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    canonicalUrl?: string
    structuredData?: Record<string, any>
}

export interface ProductRatings {
    averageRating: number
    totalReviews: number
    ratingDistribution: {
        1: number
        2: number
        3: number
        4: number
        5: number
    }
}

// DTOs for creating and updating products
export interface CreateProductData {
    name: string
    brand: string
    model: string
    sku: string
    description: string
    shortDescription?: string
    price: number
    originalPrice: number
    categoryId: string
    subCategoryId?: string
    productType: ProductType
    condition?: ProductCondition
    images: Omit<ProductImage, 'id'>[]
    attributes: Omit<ProductAttribute, 'id'>[]
    specifications: Omit<ProductSpecification, 'id'>[]
    variants?: Omit<ProductVariant, 'id'>[]
    inventory: ProductInventory
    tags?: string[]
    weight?: number
    dimensions?: ProductDimensions
    seo?: ProductSEO
}

export interface UpdateProductData extends Partial<CreateProductData> {
    status?: ProductStatus
    isActive?: boolean
    isFeatured?: boolean
}

export interface ProductFilters {
    categoryId?: string
    subCategoryId?: string
    brand?: string[]
    productType?: ProductType[]
    condition?: ProductCondition[]
    priceMin?: number
    priceMax?: number
    rating?: number
    inStock?: boolean
    isFeatured?: boolean
    attributes?: { [key: string]: string[] }
    tags?: string[]
}

export interface ProductPagination {
    page: number
    limit: number
    sortBy?:
        | 'name'
        | 'price'
        | 'rating'
        | 'createdAt'
        | 'popularity'
        | 'discount'
    sortOrder?: 'asc' | 'desc'
}

export interface ProductSearchOptions extends ProductPagination {
    query?: string
    filters?: ProductFilters
    includeVariants?: boolean
    includeOutOfStock?: boolean
}
