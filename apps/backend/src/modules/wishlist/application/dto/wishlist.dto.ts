import { z } from 'zod'
import { WishlistPriority } from '../../domain/entities/wishlist.entity'

export const AddToWishlistSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    variantId: z.string().optional(),
    notes: z.string().optional(),
    priority: z.nativeEnum(WishlistPriority).optional(),
    priceAlert: z
        .object({
            targetPrice: z.number().min(0),
            isActive: z.boolean(),
        })
        .optional(),
})

export const WishlistQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    sortBy: z.enum(['addedAt', 'price', 'name']).default('addedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    isInStock: z.coerce.boolean().optional(),
    priceMin: z.coerce.number().min(0).optional(),
    priceMax: z.coerce.number().min(0).optional(),
    model: z.string().optional(),
})

export const WishlistItemResponseSchema = z.object({
    id: z.string(),
    userId: z.string(),
    productId: z.string(),
    productName: z.string(),
    productImage: z.string(),
    productPrice: z.number(),
    productModel: z.string(),
    productStorage: z.string(),
    productColor: z.string(),
    isInStock: z.boolean(),
    addedAt: z.date(),
})

export const WishlistResponseSchema = z.object({
    userId: z.string(),
    items: z.array(WishlistItemResponseSchema),
    totalItems: z.number(),
    updatedAt: z.date(),
})

export type AddToWishlistDto = z.infer<typeof AddToWishlistSchema>
export type WishlistQueryDto = z.infer<typeof WishlistQuerySchema>
export type WishlistItemResponseDto = z.infer<typeof WishlistItemResponseSchema>
export type WishlistResponseDto = z.infer<typeof WishlistResponseSchema>
