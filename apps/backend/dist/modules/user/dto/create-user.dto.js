"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    username: zod_1.z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .optional(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    roleId: zod_1.z.string().uuid('Invalid role ID'),
});
