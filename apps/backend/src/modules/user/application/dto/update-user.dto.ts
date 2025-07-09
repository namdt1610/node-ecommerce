import { z } from 'zod'

export const UpdateUserSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    username: z.string().min(3).max(50).optional(),
    avatar: z.string().url().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>
