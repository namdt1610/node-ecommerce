import { z } from 'zod'

// Custom CUID validation
const cuidSchema = z.string().regex(/^c[0-9a-z]{24}$/i, 'Invalid CUID format')

export const OrderResponseSchema = z.object({
    id: cuidSchema,
    userId: cuidSchema,
    status: z.string(),
    total: z.number(),
    orderItems: z.array(
        z.object({
            id: cuidSchema,
            productId: cuidSchema,
            quantity: z.number().int(),
            price: z.number(),
            product: z.object({
                id: cuidSchema,
                name: z.string(),
            }),
        })
    ),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type OrderResponseDto = z.infer<typeof OrderResponseSchema>
