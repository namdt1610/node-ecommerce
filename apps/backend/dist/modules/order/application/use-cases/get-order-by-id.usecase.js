"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrderByIdUseCase = void 0;
class GetOrderByIdUseCase {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(id) {
        return await this.orderRepository.findById(id);
    }
}
exports.GetOrderByIdUseCase = GetOrderByIdUseCase;
