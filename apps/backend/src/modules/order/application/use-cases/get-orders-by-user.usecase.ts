import { IOrderRepository } from '../../domain/interfaces/order-repository.interface'
import { Order } from '../../domain/entities/order.entity'

export class GetOrdersByUserUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(
        userId: string,
        params?: {
            skip?: number
            take?: number
        }
    ): Promise<Order[]> {
        return await this.orderRepository.findByUserId(userId, params)
    }
}
