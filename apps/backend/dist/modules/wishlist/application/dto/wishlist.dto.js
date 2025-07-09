"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistResponseSchema = exports.WishlistItemResponseSchema = exports.WishlistQuerySchema = exports.AddToWishlistSchema = void 0;
const zod_1 = require("zod");
const wishlist_entity_1 = require("../../domain/entities/wishlist.entity");
exports.AddToWishlistSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Product ID is required'),
    variantId: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    priority: zod_1.z.nativeEnum(wishlist_entity_1.WishlistPriority).optional(),
    priceAlert: zod_1.z
        .object({
        targetPrice: zod_1.z.number().min(0),
        isActive: zod_1.z.boolean(),
    })
        .optional(),
});
exports.WishlistQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(20),
    sortBy: zod_1.z.enum(['addedAt', 'price', 'name']).default('addedAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
    isInStock: zod_1.z.coerce.boolean().optional(),
    priceMin: zod_1.z.coerce.number().min(0).optional(),
    priceMax: zod_1.z.coerce.number().min(0).optional(),
    model: zod_1.z.string().optional(),
});
exports.WishlistItemResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    productId: zod_1.z.string(),
    productName: zod_1.z.string(),
    productImage: zod_1.z.string(),
    productPrice: zod_1.z.number(),
    productModel: zod_1.z.string(),
    productStorage: zod_1.z.string(),
    productColor: zod_1.z.string(),
    isInStock: zod_1.z.boolean(),
    addedAt: zod_1.z.date(),
});
exports.WishlistResponseSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    items: zod_1.z.array(exports.WishlistItemResponseSchema),
    totalItems: zod_1.z.number(),
    updatedAt: zod_1.z.date(),
});
