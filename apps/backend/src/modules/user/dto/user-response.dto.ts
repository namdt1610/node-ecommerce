import { z } from 'zod'

export const UserResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    username: z.string().optional(),
    avatar: z.string().url().optional(),
    status: z.string(),
    role: z.object({
        id: z.string().uuid(),
        name: z.string(),
    }),
    favorites: z.array(z.string().uuid()),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type UserResponseDto = z.infer<typeof UserResponseSchema>
