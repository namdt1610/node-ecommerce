import { IOrderRepository } from '../../domain/order/order-repository.interface'
import { CreateOrderData, Order } from '../../domain/entities/order.entity'
import { CreateOrderDto } from '../dto/create-order.dto'

export class CreateOrderUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(createOrderDto: CreateOrderDto): Promise<Order> {
        const { userId, items, shippingAddress, paymentMethod } = createOrderDto

        // Create order data
        const orderData: CreateOrderData = {
            userId,
            items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            shippingAddress,
            paymentMethod,
        }

        return await this.orderRepository.create(orderData)
    }
}
