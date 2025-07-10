"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderSchema = void 0;
const zod_1 = require("zod");
// Custom CUID validation
const cuidSchema = zod_1.z.string().regex(/^c[0-9a-z]{24}$/i, 'Invalid CUID format');
exports.CreateOrderSchema = zod_1.z.object({
    userId: cuidSchema,
    items: zod_1.z
        .array(zod_1.z.object({
        productId: cuidSchema,
        quantity: zod_1.z
            .number()
            .int()
            .positive('Quantity must be positive'),
        price: zod_1.z.number().positive('Price must be positive'),
    }))
        .min(1, 'At least one item is required'),
    shippingAddress: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.string().optional(),
});
