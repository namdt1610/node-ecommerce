import { z } from 'zod'

export const UpdateUserSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    roleId: z.string().uuid('Invalid role ID').optional(),
})

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>
