"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseSchema = void 0;
const zod_1 = require("zod");
exports.UserResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    username: zod_1.z.string().optional(),
    avatar: zod_1.z.string().url().optional(),
    status: zod_1.z.string(),
    role: zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string(),
    }),
    favorites: zod_1.z.array(zod_1.z.string().uuid()),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
