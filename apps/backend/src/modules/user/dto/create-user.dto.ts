import { z } from 'zod'

export const CreateUserSchema = z.object({
    email: z.string().email('Invalid email format'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    roleId: z.string().uuid('Invalid role ID'),
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>
