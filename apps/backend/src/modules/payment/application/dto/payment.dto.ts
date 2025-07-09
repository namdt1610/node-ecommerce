import { z } from 'zod'

// Create Payment Intent DTO
export const CreatePaymentIntentSchema = z.object({
    orderId: z.string().uuid('Invalid order ID'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().min(3).max(3).default('USD'),
    metadata: z.record(z.string()).optional(),
})

export type CreatePaymentIntentDto = z.infer<typeof CreatePaymentIntentSchema>

// Confirm Payment DTO
export const ConfirmPaymentSchema = z.object({
    paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
    paymentMethodId: z.string().min(1, 'Payment method ID is required'),
})

export type ConfirmPaymentDto = z.infer<typeof ConfirmPaymentSchema>

// Refund Payment DTO
export const RefundPaymentSchema = z.object({
    paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
    amount: z.number().positive().optional(),
    reason: z
        .enum(['duplicate', 'fraudulent', 'requested_by_customer'])
        .optional(),
})

export type RefundPaymentDto = z.infer<typeof RefundPaymentSchema>

// Payment Intent Response DTO
export const PaymentIntentResponseSchema = z.object({
    id: z.string(),
    amount: z.number(),
    currency: z.string(),
    status: z.string(),
    clientSecret: z.string(),
    metadata: z.record(z.string()).optional(),
})

export type PaymentIntentResponseDto = z.infer<
    typeof PaymentIntentResponseSchema
>

// Webhook Event DTO
export const WebhookEventSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({
        object: z.any(),
    }),
    created: z.number(),
})

export type WebhookEventDto = z.infer<typeof WebhookEventSchema>
