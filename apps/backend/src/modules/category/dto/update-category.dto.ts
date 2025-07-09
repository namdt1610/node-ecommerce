import { z } from 'zod'

export const UpdateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').optional(),
    description: z.string().optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
})

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>
