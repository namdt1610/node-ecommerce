import { z } from 'zod'

export const UpdateOrderSchema = z.object({
    status: z
        .enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
        .optional(),
})

export type UpdateOrderDto = z.infer<typeof UpdateOrderSchema>
