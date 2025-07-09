"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartSummaryResponseSchema = exports.CartResponseSchema = exports.CartItemResponseSchema = exports.UpdateCartItemSchema = exports.AddToCartSchema = void 0;
const zod_1 = require("zod");
exports.AddToCartSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Product ID is required'),
    quantity: zod_1.z
        .number()
        .int()
        .min(1, 'Quantity must be at least 1')
        .max(99, 'Quantity cannot exceed 99'),
});
exports.UpdateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z
        .number()
        .int()
        .min(1, 'Quantity must be at least 1')
        .max(99, 'Quantity cannot exceed 99'),
});
exports.CartItemResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    productId: zod_1.z.string(),
    productName: zod_1.z.string(),
    productImage: zod_1.z.string(),
    productPrice: zod_1.z.number(),
    quantity: zod_1.z.number(),
    totalPrice: zod_1.z.number(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CartResponseSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    items: zod_1.z.array(exports.CartItemResponseSchema),
    totalItems: zod_1.z.number(),
    totalAmount: zod_1.z.number(),
    currency: zod_1.z.string(),
    updatedAt: zod_1.z.date(),
});
exports.CartSummaryResponseSchema = zod_1.z.object({
    totalItems: zod_1.z.number(),
    totalAmount: zod_1.z.number(),
    subtotal: zod_1.z.number(),
    tax: zod_1.z.number(),
    shipping: zod_1.z.number(),
    currency: zod_1.z.string(),
});
