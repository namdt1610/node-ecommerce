import { z } from 'zod'

export const CreateProductSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    imageUrl: z.string().url('Invalid image URL').optional(),
    categoryId: z.string().uuid('Invalid category ID'),
})

export type CreateProductDto = z.infer<typeof CreateProductSchema>
