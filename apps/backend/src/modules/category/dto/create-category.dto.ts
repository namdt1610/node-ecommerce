import { z } from 'zod'

export const CreateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    description: z.string().optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
})

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>
