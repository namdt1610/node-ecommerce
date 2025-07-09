"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveFromCartUseCase = void 0;
const cart_errors_1 = require("../../domain/errors/cart-errors");
class RemoveFromCartUseCase {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(userId, itemId) {
        // Verify item exists and belongs to user
        const cartItem = await this.cartRepository.findCartItem(userId, itemId);
        if (!cartItem) {
            throw new cart_errors_1.CartItemNotFoundError(itemId);
        }
        await this.cartRepository.removeItem(itemId);
    }
}
exports.RemoveFromCartUseCase = RemoveFromCartUseCase;
