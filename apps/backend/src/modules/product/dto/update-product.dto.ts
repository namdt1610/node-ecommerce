import { z } from 'zod'

export const UpdateProductSchema = z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive').optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
    categoryId: z.string().uuid('Invalid category ID').optional(),
})

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>
