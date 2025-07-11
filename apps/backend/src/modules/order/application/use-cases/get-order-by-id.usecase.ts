import { IOrderRepository } from '../../domain/interfaces/order-repository.interface'
import { Order } from '../../domain/entities/order.entity'

export class GetOrderByIdUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(id: string): Promise<Order | null> {
        return await this.orderRepository.findById(id)
    }
}
