"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAddToCartUseCase = void 0;
class SimpleAddToCartUseCase {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(data) {
        // Check if item already exists in cart
        const existingItem = await this.cartRepository.findCartItem(data.userId, data.productId);
        if (existingItem) {
            // Update quantity if item already exists
            return this.cartRepository.updateItem(existingItem.id, {
                quantity: existingItem.quantity + data.quantity,
            });
        }
        // Add new item to cart
        return this.cartRepository.addItem(data);
    }
}
exports.SimpleAddToCartUseCase = SimpleAddToCartUseCase;
