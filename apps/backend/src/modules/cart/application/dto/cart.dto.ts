import { z } from 'zod'

export const AddToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z
        .number()
        .int()
        .min(1, 'Quantity must be at least 1')
        .max(99, 'Quantity cannot exceed 99'),
})

export const UpdateCartItemSchema = z.object({
    quantity: z
        .number()
        .int()
        .min(1, 'Quantity must be at least 1')
        .max(99, 'Quantity cannot exceed 99'),
})

export const CartItemResponseSchema = z.object({
    id: z.string(),
    userId: z.string(),
    productId: z.string(),
    productName: z.string(),
    productImage: z.string(),
    productPrice: z.number(),
    quantity: z.number(),
    totalPrice: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const CartResponseSchema = z.object({
    userId: z.string(),
    items: z.array(CartItemResponseSchema),
    totalItems: z.number(),
    totalAmount: z.number(),
    currency: z.string(),
    updatedAt: z.date(),
})

export const CartSummaryResponseSchema = z.object({
    totalItems: z.number(),
    totalAmount: z.number(),
    subtotal: z.number(),
    tax: z.number(),
    shipping: z.number(),
    currency: z.string(),
})

export type AddToCartDto = z.infer<typeof AddToCartSchema>
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemSchema>
export type CartItemResponseDto = z.infer<typeof CartItemResponseSchema>
export type CartResponseDto = z.infer<typeof CartResponseSchema>
export type CartSummaryResponseDto = z.infer<typeof CartSummaryResponseSchema>
