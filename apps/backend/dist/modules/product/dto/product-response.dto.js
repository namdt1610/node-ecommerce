"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductResponseSchema = void 0;
const zod_1 = require("zod");
exports.ProductResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number(),
    originalPrice: zod_1.z.number().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    variants: zod_1.z.array(zod_1.z.any()).optional(),
    category: zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string(),
    }),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
