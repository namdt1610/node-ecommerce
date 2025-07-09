"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductSchema = void 0;
const zod_1 = require("zod");
exports.UpdateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required').optional(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive('Price must be positive').optional(),
    imageUrl: zod_1.z.string().url('Invalid image URL').optional(),
    categoryId: zod_1.z.string().uuid('Invalid category ID').optional(),
});
