"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategorySchema = void 0;
const zod_1 = require("zod");
exports.CreateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required'),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url('Invalid image URL').optional(),
});
