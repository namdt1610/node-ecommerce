"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderUseCase = void 0;
class CreateOrderUseCase {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(createOrderDto) {
        const { userId, items, shippingAddress, paymentMethod } = createOrderDto;
        // Create order data
        const orderData = {
            userId,
            items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            shippingAddress,
            paymentMethod,
        };
        return await this.orderRepository.create(orderData);
    }
}
exports.CreateOrderUseCase = CreateOrderUseCase;
