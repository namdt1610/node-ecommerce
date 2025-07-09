import { z } from 'zod'

export const OrderResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    status: z.string(),
    total: z.number(),
    orderItems: z.array(
        z.object({
            id: z.string().uuid(),
            productId: z.string().uuid(),
            quantity: z.number().int(),
            price: z.number(),
            product: z.object({
                id: z.string().uuid(),
                name: z.string(),
            }),
        })
    ),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type OrderResponseDto = z.infer<typeof OrderResponseSchema>
