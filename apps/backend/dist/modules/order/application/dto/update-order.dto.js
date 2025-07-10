"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderSchema = void 0;
const zod_1 = require("zod");
exports.UpdateOrderSchema = zod_1.z.object({
    status: zod_1.z
        .enum([
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'RETURNED',
        'REFUNDED',
    ])
        .optional(),
});
