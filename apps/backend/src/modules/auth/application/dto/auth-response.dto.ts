import { z } from 'zod'

export const AuthResponseSchema = z.object({
    user: z.object({
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
    }),
    accessToken: z.string(),
    refreshToken: z.string(),
})

export type AuthResponseDto = z.infer<typeof AuthResponseSchema>
