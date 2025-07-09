import { z } from 'zod'
import {
    ProductType,
    ProductCondition,
    AttributeType,
} from '../../domain/entities/product.entity'

// Enum schemas
export const ProductTypeSchema = z.nativeEnum(ProductType)
export const ProductConditionSchema = z.nativeEnum(ProductCondition)
export const AttributeTypeSchema = z.nativeEnum(AttributeType)

// Base schemas for nested objects
export const ProductImageSchema = z.object({
    url: z.string().url(),
    alt: z.string(),
    position: z.number().int().min(0),
    isPrimary: z.boolean(),
    variants: z.array(z.string()).optional(),
})

export const ProductVideoSchema = z.object({
    url: z.string().url(),
    title: z.string(),
    thumbnail: z.string().url(),
    duration: z.number().int().min(0).optional(),
    position: z.number().int().min(0),
})

export const ProductAttributeSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
    type: AttributeTypeSchema,
    isFilterable: z.boolean(),
    isRequired: z.boolean(),
    displayOrder: z.number().int().min(0),
})

export const ProductSpecificationSchema = z.object({
    category: z.string().min(1),
    name: z.string().min(1),
    value: z.string().min(1),
    unit: z.string().optional(),
    displayOrder: z.number().int().min(0),
})

export const VariantAttributeSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})

export const VariantInventorySchema = z.object({
    quantity: z.number().int().min(0),
    reservedQuantity: z.number().int().min(0).default(0),
    availableQuantity: z.number().int().min(0),
    lowStockThreshold: z.number().int().min(0).default(5),
})

export const ProductVariantSchema = z.object({
    name: z.string().min(1),
    sku: z.string().min(1),
    price: z.number().min(0).optional(),
    originalPrice: z.number().min(0).optional(),
    attributes: z.array(VariantAttributeSchema),
    images: z.array(z.string()).optional(),
    inventory: VariantInventorySchema,
    isActive: z.boolean().default(true),
})

export const ProductInventorySchema = z.object({
    totalQuantity: z.number().int().min(0),
    reservedQuantity: z.number().int().min(0).default(0),
    availableQuantity: z.number().int().min(0),
    lowStockThreshold: z.number().int().min(0).default(5),
    trackQuantity: z.boolean().default(true),
    allowBackorder: z.boolean().default(false),
    backorderLimit: z.number().int().min(0).optional(),
})

export const ProductDimensionsSchema = z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
    unit: z.enum(['cm', 'inch']),
})

export const ProductShippingInfoSchema = z.object({
    weight: z.number().min(0),
    weightUnit: z.enum(['kg', 'lb']),
    dimensions: ProductDimensionsSchema,
    shippingClass: z.string().optional(),
    freeShipping: z.boolean().default(false),
    shippingCost: z.number().min(0).optional(),
})

export const ProductSEOSchema = z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    metaKeywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().url().optional(),
    structuredData: z.record(z.any()).optional(),
})

// Main DTO schemas
export const CreateProductSchema = z
    .object({
        name: z.string().min(1).max(255),
        brand: z.string().min(1).max(100),
        model: z.string().min(1).max(100),
        sku: z.string().min(1).max(50),
        description: z.string().min(1),
        shortDescription: z.string().max(500).optional(),
        price: z.number().min(0),
        originalPrice: z.number().min(0),
        categoryId: z.string().uuid(),
        subCategoryId: z.string().uuid().optional(),
        productType: ProductTypeSchema,
        condition: ProductConditionSchema.optional().default(ProductCondition.NEW),
        images: z.array(ProductImageSchema).min(1),
        videos: z.array(ProductVideoSchema).optional(),
        attributes: z.array(ProductAttributeSchema).default([]),
        specifications: z.array(ProductSpecificationSchema).default([]),
        variants: z.array(ProductVariantSchema).optional(),
        inventory: ProductInventorySchema,
        tags: z.array(z.string()).default([]),
        weight: z.number().min(0).optional(),
        dimensions: ProductDimensionsSchema.optional(),
        shippingInfo: ProductShippingInfoSchema.optional(),
        seo: ProductSEOSchema.optional(),
    })
    .refine((data) => data.originalPrice >= data.price, {
        message:
            'Original price must be greater than or equal to current price',
        path: ['originalPrice'],
    })

export const UpdateProductSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    brand: z.string().min(1).max(100).optional(),
    model: z.string().min(1).max(100).optional(),
    sku: z.string().min(1).max(50).optional(),
    description: z.string().min(1).optional(),
    shortDescription: z.string().max(500).optional(),
    price: z.number().min(0).optional(),
    originalPrice: z.number().min(0).optional(),
    categoryId: z.string().uuid().optional(),
    subCategoryId: z.string().uuid().optional(),
    productType: ProductTypeSchema.optional(),
    condition: ProductConditionSchema.optional(),
    images: z.array(ProductImageSchema).optional(),
    videos: z.array(ProductVideoSchema).optional(),
    attributes: z.array(ProductAttributeSchema).optional(),
    specifications: z.array(ProductSpecificationSchema).optional(),
    variants: z.array(ProductVariantSchema).optional(),
    inventory: ProductInventorySchema.optional(),
    tags: z.array(z.string()).optional(),
    weight: z.number().min(0).optional(),
    dimensions: ProductDimensionsSchema.optional(),
    shippingInfo: ProductShippingInfoSchema.optional(),
    seo: ProductSEOSchema.optional(),
    status: z
        .enum([
            'ACTIVE',
            'INACTIVE',
            'OUT_OF_STOCK',
            'DISCONTINUED',
            'COMING_SOON',
        ])
        .optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
})

export const ProductFiltersSchema = z
    .object({
        categoryId: z.string().uuid().optional(),
        subCategoryId: z.string().uuid().optional(),
        brand: z.array(z.string()).optional(),
        productType: z.array(ProductTypeSchema).optional(),
        condition: z.array(ProductConditionSchema).optional(),
        priceMin: z.number().min(0).optional(),
        priceMax: z.number().min(0).optional(),
        rating: z.number().min(1).max(5).optional(),
        inStock: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        attributes: z.record(z.array(z.string())).optional(),
        tags: z.array(z.string()).optional(),
    })
    .refine(
        (data) => {
            if (data.priceMin !== undefined && data.priceMax !== undefined) {
                return data.priceMax >= data.priceMin
            }
            return true
        },
        {
            message: 'Price max must be greater than or equal to price min',
            path: ['priceMax'],
        }
    )

export const ProductPaginationSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z
        .enum([
            'name',
            'price',
            'rating',
            'createdAt',
            'popularity',
            'discount',
        ])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const ProductSearchSchema = ProductPaginationSchema.extend({
    query: z.string().optional(),
    filters: ProductFiltersSchema.optional(),
    includeVariants: z.boolean().default(false),
    includeOutOfStock: z.boolean().default(false),
})

// Query parameter schemas for REST API
export const GetProductsQuerySchema = z.object({
    page: z
        .string()
        .transform(Number)
        .pipe(z.number().int().min(1))
        .default('1'),
    limit: z
        .string()
        .transform(Number)
        .pipe(z.number().int().min(1).max(100))
        .default('20'),
    sortBy: z
        .enum([
            'name',
            'price',
            'rating',
            'createdAt',
            'popularity',
            'discount',
        ])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    query: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    subCategoryId: z.string().uuid().optional(),
    brand: z
        .string()
        .optional()
        .transform((val) => (val ? val.split(',') : undefined)),
    productType: z
        .string()
        .optional()
        .transform((val) =>
            val ? (val.split(',') as ProductType[]) : undefined
        ),
    condition: z
        .string()
        .optional()
        .transform((val) =>
            val ? (val.split(',') as ProductCondition[]) : undefined
        ),
    priceMin: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    priceMax: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    rating: z
        .string()
        .transform(Number)
        .pipe(z.number().min(1).max(5))
        .optional(),
    inStock: z
        .string()
        .transform((val) => val === 'true')
        .optional(),
    isFeatured: z
        .string()
        .transform((val) => val === 'true')
        .optional(),
    tags: z
        .string()
        .optional()
        .transform((val) => (val ? val.split(',') : undefined)),
    includeVariants: z
        .string()
        .transform((val) => val === 'true')
        .default('false'),
    includeOutOfStock: z
        .string()
        .transform((val) => val === 'true')
        .default('false'),
})

export const ProductIdSchema = z.object({
    id: z.string().uuid(),
})

export const ProductSlugSchema = z.object({
    slug: z.string().min(1),
})

export const ProductSkuSchema = z.object({
    sku: z.string().min(1),
})

// Bulk operation schemas
export const BulkUpdatePricesSchema = z.object({
    updates: z
        .array(
            z.object({
                id: z.string().uuid(),
                price: z.number().min(0),
                originalPrice: z.number().min(0).optional(),
            })
        )
        .min(1),
})

export const BulkUpdateStatusSchema = z.object({
    productIds: z.array(z.string().uuid()).min(1),
    status: z.enum([
        'ACTIVE',
        'INACTIVE',
        'OUT_OF_STOCK',
        'DISCONTINUED',
        'COMING_SOON',
    ]),
})

export const UpdateInventorySchema = z.object({
    quantity: z.number().int().min(0),
})

export const ReserveQuantitySchema = z.object({
    quantity: z.number().int().min(1),
})

// Response schemas
export const ProductResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    brand: z.string(),
    model: z.string(),
    sku: z.string(),
    description: z.string(),
    shortDescription: z.string().optional(),
    price: z.number(),
    originalPrice: z.number(),
    discount: z.number().optional(),
    currency: z.string(),
    categoryId: z.string().uuid(),
    category: z
        .object({
            id: z.string().uuid(),
            name: z.string(),
            slug: z.string(),
            icon: z.string().optional(),
            description: z.string().optional(),
        })
        .optional(),
    subCategoryId: z.string().uuid().optional(),
    productType: ProductTypeSchema,
    condition: ProductConditionSchema,
    status: z.enum([
        'ACTIVE',
        'INACTIVE',
        'OUT_OF_STOCK',
        'DISCONTINUED',
        'COMING_SOON',
    ]),
    images: z.array(ProductImageSchema),
    videos: z.array(ProductVideoSchema).optional(),
    attributes: z.array(ProductAttributeSchema),
    specifications: z.array(ProductSpecificationSchema),
    variants: z.array(ProductVariantSchema),
    inventory: ProductInventorySchema,
    seo: ProductSEOSchema,
    ratings: z.object({
        averageRating: z.number().min(0).max(5),
        totalReviews: z.number().int().min(0),
        ratingDistribution: z.object({
            1: z.number().int().min(0),
            2: z.number().int().min(0),
            3: z.number().int().min(0),
            4: z.number().int().min(0),
            5: z.number().int().min(0),
        }),
    }),
    tags: z.array(z.string()),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    isDigital: z.boolean(),
    weight: z.number().optional(),
    dimensions: ProductDimensionsSchema.optional(),
    shippingInfo: ProductShippingInfoSchema.optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const ProductListResponseSchema = z.object({
    products: z.array(ProductResponseSchema),
    total: z.number().int().min(0),
    hasMore: z.boolean(),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    totalPages: z.number().int().min(0),
})

// Type exports
export type CreateProductDto = z.infer<typeof CreateProductSchema>
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>
export type ProductFiltersDto = z.infer<typeof ProductFiltersSchema>
export type ProductPaginationDto = z.infer<typeof ProductPaginationSchema>
export type ProductSearchDto = z.infer<typeof ProductSearchSchema>
export type GetProductsQueryDto = z.infer<typeof GetProductsQuerySchema>
export type ProductIdDto = z.infer<typeof ProductIdSchema>
export type ProductSlugDto = z.infer<typeof ProductSlugSchema>
export type ProductSkuDto = z.infer<typeof ProductSkuSchema>
export type BulkUpdatePricesDto = z.infer<typeof BulkUpdatePricesSchema>
export type BulkUpdateStatusDto = z.infer<typeof BulkUpdateStatusSchema>
export type UpdateInventoryDto = z.infer<typeof UpdateInventorySchema>
export type ReserveQuantityDto = z.infer<typeof ReserveQuantitySchema>
export type ProductResponseDto = z.infer<typeof ProductResponseSchema>
export type ProductListResponseDto = z.infer<typeof ProductListResponseSchema>
