import { z } from 'zod'

export const UserResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    username: z.string().optional(),
    avatar: z.string().optional(),
    status: z.string(),
    role: z.object({
        id: z.string(),
        name: z.string(),
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type UserResponseDto = z.infer<typeof UserResponseSchema>
