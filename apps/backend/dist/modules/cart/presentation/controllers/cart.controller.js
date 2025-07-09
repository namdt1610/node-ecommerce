"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const zod_1 = require("zod");
const dto_1 = require("../../application/dto");
class CartController {
    addToCartUseCase;
    getCartUseCase;
    updateCartItemUseCase;
    removeFromCartUseCase;
    clearCartUseCase;
    constructor(addToCartUseCase, getCartUseCase, updateCartItemUseCase, removeFromCartUseCase, clearCartUseCase) {
        this.addToCartUseCase = addToCartUseCase;
        this.getCartUseCase = getCartUseCase;
        this.updateCartItemUseCase = updateCartItemUseCase;
        this.removeFromCartUseCase = removeFromCartUseCase;
        this.clearCartUseCase = clearCartUseCase;
    }
    async getCart(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const cart = await this.getCartUseCase.execute(userId);
            res.json({
                success: true,
                data: cart || {
                    userId,
                    items: [],
                    totalItems: 0,
                    totalAmount: 0,
                    currency: 'USD',
                    updatedAt: new Date(),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async addToCart(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const addToCartDto = dto_1.AddToCartSchema.parse(req.body);
            const cartItem = await this.addToCartUseCase.execute(userId, addToCartDto);
            res.status(201).json({
                success: true,
                data: cartItem,
                message: 'Item added to cart successfully',
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            next(error);
        }
    }
    async updateCartItem(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const { itemId } = req.params;
            const updateCartItemDto = dto_1.UpdateCartItemSchema.parse(req.body);
            const cartItem = await this.updateCartItemUseCase.execute(userId, itemId, updateCartItemDto);
            res.json({
                success: true,
                data: cartItem,
                message: 'Cart item updated successfully',
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            next(error);
        }
    }
    async removeFromCart(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const { itemId } = req.params;
            await this.removeFromCartUseCase.execute(userId, itemId);
            res.json({
                success: true,
                message: 'Item removed from cart successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async clearCart(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            await this.clearCartUseCase.execute(userId);
            res.json({
                success: true,
                message: 'Cart cleared successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCartItemsCount(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const cart = await this.getCartUseCase.execute(userId);
            const totalItems = cart?.totalItems || 0;
            res.json({
                success: true,
                data: { totalItems },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CartController = CartController;
