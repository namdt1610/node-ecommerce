import {
    Order,
    OrderStatus,
    CreateOrderData,
    UpdateOrderData,
} from '../entities/order.entity'

export interface IOrderRepository {
    create(data: CreateOrderData): Promise<Order>
    findById(id: string): Promise<Order | null>
    findByUserId(
        userId: string,
        params?: {
            skip?: number
            take?: number
        }
    ): Promise<Order[]>
    update(id: string, data: UpdateOrderData): Promise<Order>
    delete(id: string): Promise<void>
    count(userId?: string): Promise<number>
}
