"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrdersByUserUseCase = void 0;
class GetOrdersByUserUseCase {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(userId, params) {
        return await this.orderRepository.findByUserId(userId, params);
    }
}
exports.GetOrdersByUserUseCase = GetOrdersByUserUseCase;
