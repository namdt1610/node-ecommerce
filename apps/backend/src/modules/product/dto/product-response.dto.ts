import { z } from 'zod'

export const ProductResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    price: z.number(),
    originalPrice: z.number().optional(),
    imageUrl: z.string().url().optional(),
    variants: z.array(z.any()).optional(),
    category: z.object({
        id: z.string().uuid(),
        name: z.string(),
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type ProductResponseDto = z.infer<typeof ProductResponseSchema>
