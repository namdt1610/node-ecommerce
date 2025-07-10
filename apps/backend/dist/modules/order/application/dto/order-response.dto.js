"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderResponseSchema = void 0;
const zod_1 = require("zod");
// Custom CUID validation
const cuidSchema = zod_1.z.string().regex(/^c[0-9a-z]{24}$/i, 'Invalid CUID format');
exports.OrderResponseSchema = zod_1.z.object({
    id: cuidSchema,
    userId: cuidSchema,
    status: zod_1.z.string(),
    total: zod_1.z.number(),
    orderItems: zod_1.z.array(zod_1.z.object({
        id: cuidSchema,
        productId: cuidSchema,
        quantity: zod_1.z.number().int(),
        price: zod_1.z.number(),
        product: zod_1.z.object({
            id: cuidSchema,
            name: zod_1.z.string(),
        }),
    })),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
