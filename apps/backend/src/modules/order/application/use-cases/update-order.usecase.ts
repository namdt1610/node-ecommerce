import { IOrderRepository } from '../../domain/order/order-repository.interface'
import {
    Order,
    UpdateOrderData,
    OrderStatus,
} from '../../domain/entities/order.entity'
import { UpdateOrderDto } from '../dto/update-order.dto'

export class UpdateOrderUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const updateData: UpdateOrderData = {
            status: updateOrderDto.status as OrderStatus,
        }

        return await this.orderRepository.update(id, updateData)
    }
}
