"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderUseCase = void 0;
class UpdateOrderUseCase {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(id, updateOrderDto) {
        const updateData = {
            status: updateOrderDto.status,
        };
        return await this.orderRepository.update(id, updateData);
    }
}
exports.UpdateOrderUseCase = UpdateOrderUseCase;
