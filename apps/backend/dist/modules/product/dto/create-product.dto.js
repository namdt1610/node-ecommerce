"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductSchema = void 0;
const zod_1 = require("zod");
exports.CreateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required'),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive('Price must be positive'),
    imageUrl: zod_1.z.string().url('Invalid image URL').optional(),
    categoryId: zod_1.z.string().uuid('Invalid category ID'),
});
