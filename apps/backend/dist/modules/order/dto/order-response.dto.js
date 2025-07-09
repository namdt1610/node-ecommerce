"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderResponseSchema = void 0;
const zod_1 = require("zod");
exports.OrderResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    status: zod_1.z.string(),
    total: zod_1.z.number(),
    orderItems: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        productId: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().int(),
        price: zod_1.z.number(),
        product: zod_1.z.object({
            id: zod_1.z.string().uuid(),
            name: zod_1.z.string(),
        }),
    })),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
