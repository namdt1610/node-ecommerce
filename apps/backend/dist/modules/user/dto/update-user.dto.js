"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    username: zod_1.z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .optional(),
    avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
    roleId: zod_1.z.string().uuid('Invalid role ID').optional(),
});
