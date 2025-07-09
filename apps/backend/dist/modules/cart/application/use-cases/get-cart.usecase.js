"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCartUseCase = void 0;
class GetCartUseCase {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(userId) {
        return await this.cartRepository.findByUserId(userId);
    }
}
exports.GetCartUseCase = GetCartUseCase;
