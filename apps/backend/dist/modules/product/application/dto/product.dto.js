"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductListResponseSchema = exports.ProductResponseSchema = exports.ReserveQuantitySchema = exports.UpdateInventorySchema = exports.BulkUpdateStatusSchema = exports.BulkUpdatePricesSchema = exports.ProductSkuSchema = exports.ProductSlugSchema = exports.ProductIdSchema = exports.GetProductsQuerySchema = exports.ProductSearchSchema = exports.ProductPaginationSchema = exports.ProductFiltersSchema = exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductSEOSchema = exports.ProductShippingInfoSchema = exports.ProductDimensionsSchema = exports.ProductInventorySchema = exports.ProductVariantSchema = exports.VariantInventorySchema = exports.VariantAttributeSchema = exports.ProductSpecificationSchema = exports.ProductAttributeSchema = exports.ProductVideoSchema = exports.ProductImageSchema = exports.AttributeTypeSchema = exports.ProductConditionSchema = exports.ProductTypeSchema = void 0;
const zod_1 = require("zod");
const product_entity_1 = require("../../domain/entities/product.entity");
// Enum schemas
exports.ProductTypeSchema = zod_1.z.nativeEnum(product_entity_1.ProductType);
exports.ProductConditionSchema = zod_1.z.nativeEnum(product_entity_1.ProductCondition);
exports.AttributeTypeSchema = zod_1.z.nativeEnum(product_entity_1.AttributeType);
// Base schemas for nested objects
exports.ProductImageSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    alt: zod_1.z.string(),
    position: zod_1.z.number().int().min(0),
    isPrimary: zod_1.z.boolean(),
    variants: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.ProductVideoSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    title: zod_1.z.string(),
    thumbnail: zod_1.z.string().url(),
    duration: zod_1.z.number().int().min(0).optional(),
    position: zod_1.z.number().int().min(0),
});
exports.ProductAttributeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    value: zod_1.z.string().min(1),
    type: exports.AttributeTypeSchema,
    isFilterable: zod_1.z.boolean(),
    isRequired: zod_1.z.boolean(),
    displayOrder: zod_1.z.number().int().min(0),
});
exports.ProductSpecificationSchema = zod_1.z.object({
    category: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    value: zod_1.z.string().min(1),
    unit: zod_1.z.string().optional(),
    displayOrder: zod_1.z.number().int().min(0),
});
exports.VariantAttributeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    value: zod_1.z.string().min(1),
});
exports.VariantInventorySchema = zod_1.z.object({
    quantity: zod_1.z.number().int().min(0),
    reservedQuantity: zod_1.z.number().int().min(0).default(0),
    availableQuantity: zod_1.z.number().int().min(0),
    lowStockThreshold: zod_1.z.number().int().min(0).default(5),
});
exports.ProductVariantSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    sku: zod_1.z.string().min(1),
    price: zod_1.z.number().min(0).optional(),
    originalPrice: zod_1.z.number().min(0).optional(),
    attributes: zod_1.z.array(exports.VariantAttributeSchema),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    inventory: exports.VariantInventorySchema,
    isActive: zod_1.z.boolean().default(true),
});
exports.ProductInventorySchema = zod_1.z.object({
    totalQuantity: zod_1.z.number().int().min(0),
    reservedQuantity: zod_1.z.number().int().min(0).default(0),
    availableQuantity: zod_1.z.number().int().min(0),
    lowStockThreshold: zod_1.z.number().int().min(0).default(5),
    trackQuantity: zod_1.z.boolean().default(true),
    allowBackorder: zod_1.z.boolean().default(false),
    backorderLimit: zod_1.z.number().int().min(0).optional(),
});
exports.ProductDimensionsSchema = zod_1.z.object({
    length: zod_1.z.number().min(0),
    width: zod_1.z.number().min(0),
    height: zod_1.z.number().min(0),
    unit: zod_1.z.enum(['cm', 'inch']),
});
exports.ProductShippingInfoSchema = zod_1.z.object({
    weight: zod_1.z.number().min(0),
    weightUnit: zod_1.z.enum(['kg', 'lb']),
    dimensions: exports.ProductDimensionsSchema,
    shippingClass: zod_1.z.string().optional(),
    freeShipping: zod_1.z.boolean().default(false),
    shippingCost: zod_1.z.number().min(0).optional(),
});
exports.ProductSEOSchema = zod_1.z.object({
    metaTitle: zod_1.z.string().max(60).optional(),
    metaDescription: zod_1.z.string().max(160).optional(),
    metaKeywords: zod_1.z.array(zod_1.z.string()).optional(),
    canonicalUrl: zod_1.z.string().url().optional(),
    structuredData: zod_1.z.record(zod_1.z.any()).optional(),
});
// Main DTO schemas
exports.CreateProductSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1).max(255),
    brand: zod_1.z.string().min(1).max(100),
    model: zod_1.z.string().min(1).max(100),
    sku: zod_1.z.string().min(1).max(50),
    description: zod_1.z.string().min(1),
    shortDescription: zod_1.z.string().max(500).optional(),
    price: zod_1.z.number().min(0),
    originalPrice: zod_1.z.number().min(0),
    categoryId: zod_1.z.string().uuid(),
    subCategoryId: zod_1.z.string().uuid().optional(),
    productType: exports.ProductTypeSchema,
    condition: exports.ProductConditionSchema.optional().default(product_entity_1.ProductCondition.NEW),
    images: zod_1.z.array(exports.ProductImageSchema).min(1),
    videos: zod_1.z.array(exports.ProductVideoSchema).optional(),
    attributes: zod_1.z.array(exports.ProductAttributeSchema).default([]),
    specifications: zod_1.z.array(exports.ProductSpecificationSchema).default([]),
    variants: zod_1.z.array(exports.ProductVariantSchema).optional(),
    inventory: exports.ProductInventorySchema,
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    weight: zod_1.z.number().min(0).optional(),
    dimensions: exports.ProductDimensionsSchema.optional(),
    shippingInfo: exports.ProductShippingInfoSchema.optional(),
    seo: exports.ProductSEOSchema.optional(),
})
    .refine((data) => data.originalPrice >= data.price, {
    message: 'Original price must be greater than or equal to current price',
    path: ['originalPrice'],
});
exports.UpdateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
    brand: zod_1.z.string().min(1).max(100).optional(),
    model: zod_1.z.string().min(1).max(100).optional(),
    sku: zod_1.z.string().min(1).max(50).optional(),
    description: zod_1.z.string().min(1).optional(),
    shortDescription: zod_1.z.string().max(500).optional(),
    price: zod_1.z.number().min(0).optional(),
    originalPrice: zod_1.z.number().min(0).optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    subCategoryId: zod_1.z.string().uuid().optional(),
    productType: exports.ProductTypeSchema.optional(),
    condition: exports.ProductConditionSchema.optional(),
    images: zod_1.z.array(exports.ProductImageSchema).optional(),
    videos: zod_1.z.array(exports.ProductVideoSchema).optional(),
    attributes: zod_1.z.array(exports.ProductAttributeSchema).optional(),
    specifications: zod_1.z.array(exports.ProductSpecificationSchema).optional(),
    variants: zod_1.z.array(exports.ProductVariantSchema).optional(),
    inventory: exports.ProductInventorySchema.optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    weight: zod_1.z.number().min(0).optional(),
    dimensions: exports.ProductDimensionsSchema.optional(),
    shippingInfo: exports.ProductShippingInfoSchema.optional(),
    seo: exports.ProductSEOSchema.optional(),
    status: zod_1.z
        .enum([
        'ACTIVE',
        'INACTIVE',
        'OUT_OF_STOCK',
        'DISCONTINUED',
        'COMING_SOON',
    ])
        .optional(),
    isActive: zod_1.z.boolean().optional(),
    isFeatured: zod_1.z.boolean().optional(),
});
exports.ProductFiltersSchema = zod_1.z
    .object({
    categoryId: zod_1.z.string().uuid().optional(),
    subCategoryId: zod_1.z.string().uuid().optional(),
    brand: zod_1.z.array(zod_1.z.string()).optional(),
    productType: zod_1.z.array(exports.ProductTypeSchema).optional(),
    condition: zod_1.z.array(exports.ProductConditionSchema).optional(),
    priceMin: zod_1.z.number().min(0).optional(),
    priceMax: zod_1.z.number().min(0).optional(),
    rating: zod_1.z.number().min(1).max(5).optional(),
    inStock: zod_1.z.boolean().optional(),
    isFeatured: zod_1.z.boolean().optional(),
    attributes: zod_1.z.record(zod_1.z.array(zod_1.z.string())).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
})
    .refine((data) => {
    if (data.priceMin !== undefined && data.priceMax !== undefined) {
        return data.priceMax >= data.priceMin;
    }
    return true;
}, {
    message: 'Price max must be greater than or equal to price min',
    path: ['priceMax'],
});
exports.ProductPaginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    sortBy: zod_1.z
        .enum([
        'name',
        'price',
        'rating',
        'createdAt',
        'popularity',
        'discount',
    ])
        .default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.ProductSearchSchema = exports.ProductPaginationSchema.extend({
    query: zod_1.z.string().optional(),
    filters: exports.ProductFiltersSchema.optional(),
    includeVariants: zod_1.z.boolean().default(false),
    includeOutOfStock: zod_1.z.boolean().default(false),
});
// Query parameter schemas for REST API
exports.GetProductsQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().int().min(1))
        .default('1'),
    limit: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().int().min(1).max(100))
        .default('20'),
    sortBy: zod_1.z
        .enum([
        'name',
        'price',
        'rating',
        'createdAt',
        'popularity',
        'discount',
    ])
        .default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
    query: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    subCategoryId: zod_1.z.string().uuid().optional(),
    brand: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? val.split(',') : undefined)),
    productType: zod_1.z
        .string()
        .optional()
        .transform((val) => val ? val.split(',') : undefined),
    condition: zod_1.z
        .string()
        .optional()
        .transform((val) => val ? val.split(',') : undefined),
    priceMin: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(0)).optional(),
    priceMax: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(0)).optional(),
    rating: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().min(1).max(5))
        .optional(),
    inStock: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .optional(),
    isFeatured: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .optional(),
    tags: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? val.split(',') : undefined)),
    includeVariants: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .default('false'),
    includeOutOfStock: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .default('false'),
});
exports.ProductIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.ProductSlugSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1),
});
exports.ProductSkuSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1),
});
// Bulk operation schemas
exports.BulkUpdatePricesSchema = zod_1.z.object({
    updates: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        price: zod_1.z.number().min(0),
        originalPrice: zod_1.z.number().min(0).optional(),
    }))
        .min(1),
});
exports.BulkUpdateStatusSchema = zod_1.z.object({
    productIds: zod_1.z.array(zod_1.z.string().uuid()).min(1),
    status: zod_1.z.enum([
        'ACTIVE',
        'INACTIVE',
        'OUT_OF_STOCK',
        'DISCONTINUED',
        'COMING_SOON',
    ]),
});
exports.UpdateInventorySchema = zod_1.z.object({
    quantity: zod_1.z.number().int().min(0),
});
exports.ReserveQuantitySchema = zod_1.z.object({
    quantity: zod_1.z.number().int().min(1),
});
// Response schemas
exports.ProductResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    brand: zod_1.z.string(),
    model: zod_1.z.string(),
    sku: zod_1.z.string(),
    description: zod_1.z.string(),
    shortDescription: zod_1.z.string().optional(),
    price: zod_1.z.number(),
    originalPrice: zod_1.z.number(),
    discount: zod_1.z.number().optional(),
    currency: zod_1.z.string(),
    categoryId: zod_1.z.string().uuid(),
    category: zod_1.z
        .object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string(),
        slug: zod_1.z.string(),
        icon: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    })
        .optional(),
    subCategoryId: zod_1.z.string().uuid().optional(),
    productType: exports.ProductTypeSchema,
    condition: exports.ProductConditionSchema,
    status: zod_1.z.enum([
        'ACTIVE',
        'INACTIVE',
        'OUT_OF_STOCK',
        'DISCONTINUED',
        'COMING_SOON',
    ]),
    images: zod_1.z.array(exports.ProductImageSchema),
    videos: zod_1.z.array(exports.ProductVideoSchema).optional(),
    attributes: zod_1.z.array(exports.ProductAttributeSchema),
    specifications: zod_1.z.array(exports.ProductSpecificationSchema),
    variants: zod_1.z.array(exports.ProductVariantSchema),
    inventory: exports.ProductInventorySchema,
    seo: exports.ProductSEOSchema,
    ratings: zod_1.z.object({
        averageRating: zod_1.z.number().min(0).max(5),
        totalReviews: zod_1.z.number().int().min(0),
        ratingDistribution: zod_1.z.object({
            1: zod_1.z.number().int().min(0),
            2: zod_1.z.number().int().min(0),
            3: zod_1.z.number().int().min(0),
            4: zod_1.z.number().int().min(0),
            5: zod_1.z.number().int().min(0),
        }),
    }),
    tags: zod_1.z.array(zod_1.z.string()),
    isActive: zod_1.z.boolean(),
    isFeatured: zod_1.z.boolean(),
    isDigital: zod_1.z.boolean(),
    weight: zod_1.z.number().optional(),
    dimensions: exports.ProductDimensionsSchema.optional(),
    shippingInfo: exports.ProductShippingInfoSchema.optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.ProductListResponseSchema = zod_1.z.object({
    products: zod_1.z.array(exports.ProductResponseSchema),
    total: zod_1.z.number().int().min(0),
    hasMore: zod_1.z.boolean(),
    page: zod_1.z.number().int().min(1),
    limit: zod_1.z.number().int().min(1),
    totalPages: zod_1.z.number().int().min(0),
});
