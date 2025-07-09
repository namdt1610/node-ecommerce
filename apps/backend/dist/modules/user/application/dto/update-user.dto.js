"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
    username: zod_1.z.string().min(3).max(50).optional(),
    avatar: zod_1.z.string().url().optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
