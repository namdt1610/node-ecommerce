import { z } from 'zod'

export const ResetPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
})

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>
