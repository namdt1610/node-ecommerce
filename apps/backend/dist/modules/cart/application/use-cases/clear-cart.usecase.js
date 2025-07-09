"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCartUseCase = void 0;
class ClearCartUseCase {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(userId) {
        await this.cartRepository.clearCart(userId);
    }
}
exports.ClearCartUseCase = ClearCartUseCase;
