import { z } from 'zod'

export const UpdateOrderSchema = z.object({
    status: z
        .enum([
            'PENDING',
            'CONFIRMED',
            'PROCESSING',
            'SHIPPED',
            'DELIVERED',
            'CANCELLED',
            'RETURNED',
            'REFUNDED',
        ])
        .optional(),
})

export type UpdateOrderDto = z.infer<typeof UpdateOrderSchema>
