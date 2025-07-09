"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEventSchema = exports.PaymentIntentResponseSchema = exports.RefundPaymentSchema = exports.ConfirmPaymentSchema = exports.CreatePaymentIntentSchema = void 0;
const zod_1 = require("zod");
// Create Payment Intent DTO
exports.CreatePaymentIntentSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid('Invalid order ID'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    currency: zod_1.z.string().min(3).max(3).default('USD'),
    metadata: zod_1.z.record(zod_1.z.string()).optional(),
});
// Confirm Payment DTO
exports.ConfirmPaymentSchema = zod_1.z.object({
    paymentIntentId: zod_1.z.string().min(1, 'Payment intent ID is required'),
    paymentMethodId: zod_1.z.string().min(1, 'Payment method ID is required'),
});
// Refund Payment DTO
exports.RefundPaymentSchema = zod_1.z.object({
    paymentIntentId: zod_1.z.string().min(1, 'Payment intent ID is required'),
    amount: zod_1.z.number().positive().optional(),
    reason: zod_1.z
        .enum(['duplicate', 'fraudulent', 'requested_by_customer'])
        .optional(),
});
// Payment Intent Response DTO
exports.PaymentIntentResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    status: zod_1.z.string(),
    clientSecret: zod_1.z.string(),
    metadata: zod_1.z.record(zod_1.z.string()).optional(),
});
// Webhook Event DTO
exports.WebhookEventSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.string(),
    data: zod_1.z.object({
        object: zod_1.z.any(),
    }),
    created: zod_1.z.number(),
});
