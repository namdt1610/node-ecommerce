import { z } from 'zod'

export const CreateOrderSchema = z.object({
    userId: z.string().uuid('Invalid user ID'),
    items: z
        .array(
            z.object({
                productId: z.string().uuid('Invalid product ID'),
                quantity: z
                    .number()
                    .int()
                    .positive('Quantity must be positive'),
                price: z.number().positive('Price must be positive'),
            })
        )
        .min(1, 'At least one item is required'),
})

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>
