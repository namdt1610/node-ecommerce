import { z } from 'zod'

export const AuthSchema = z.object({
    email: z.string().email().nonempty({ message: 'Email is required!' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
})
