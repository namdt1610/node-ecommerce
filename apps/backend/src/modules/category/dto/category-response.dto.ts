import { z } from 'zod'

export const CategoryResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type CategoryResponseDto = z.infer<typeof CategoryResponseSchema>
