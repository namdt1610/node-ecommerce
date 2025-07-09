"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseSchema = void 0;
const zod_1 = require("zod");
exports.AuthResponseSchema = zod_1.z.object({
    user: zod_1.z.object({
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
    }),
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
});
