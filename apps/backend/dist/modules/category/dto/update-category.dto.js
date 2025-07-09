"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategorySchema = void 0;
const zod_1 = require("zod");
exports.UpdateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required').optional(),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url('Invalid image URL').optional(),
});
