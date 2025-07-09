import { z } from 'zod'

export const RegisterSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters'),
})

export type RegisterDto = z.infer<typeof RegisterSchema>
