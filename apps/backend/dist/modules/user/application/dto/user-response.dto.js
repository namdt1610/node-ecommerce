"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseSchema = void 0;
const zod_1 = require("zod");
exports.UserResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    username: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
    status: zod_1.z.string(),
    role: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
    }),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
