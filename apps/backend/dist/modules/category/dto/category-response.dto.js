"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryResponseSchema = void 0;
const zod_1 = require("zod");
exports.CategoryResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    slug: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
