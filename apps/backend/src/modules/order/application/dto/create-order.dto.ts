import { z } from 'zod'

// Custom CUID validation
const cuidSchema = z.string().regex(/^c[0-9a-z]{24}$/i, 'Invalid CUID format')

export const CreateOrderSchema = z.object({
    userId: cuidSchema,
    items: z
        .array(
            z.object({
                productId: cuidSchema,
                quantity: z
                    .number()
                    .int()
                    .positive('Quantity must be positive'),
                price: z.number().positive('Price must be positive'),
            })
        )
        .min(1, 'At least one item is required'),
    shippingAddress: z.string().optional(),
    paymentMethod: z.string().optional(),
})

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>
