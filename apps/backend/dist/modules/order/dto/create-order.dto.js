"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderSchema = void 0;
const zod_1 = require("zod");
exports.CreateOrderSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().uuid('Invalid product ID'),
        quantity: zod_1.z
            .number()
            .int()
            .positive('Quantity must be positive'),
        price: zod_1.z.number().positive('Price must be positive'),
    }))
        .min(1, 'At least one item is required'),
});
