import { OrderRepository } from './order.repository'
import { CreateOrderDto, UpdateOrderDto, OrderResponseDto } from './order.dto'
import { Order, OrderItem, Product, User } from '@prisma/client'

type OrderWithDetails = Order & {
    orderItems: (OrderItem & { product: Product })[]
    user: User
}

export class OrderService {
    constructor(private orderRepository: OrderRepository) {}

    async createOrder(
        createOrderDto: CreateOrderDto
    ): Promise<OrderResponseDto> {
        const { userId, items } = createOrderDto

        const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        )

        const order = (await this.orderRepository.create({
            user: { connect: { id: userId } },
            total,
            status: 'PENDING',
            orderItems: {
                create: items.map((item) => ({
                    product: { connect: { id: item.productId } },
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        })) as OrderWithDetails

        return this.mapToResponseDto(order)
    }

    async getOrderById(id: string): Promise<OrderResponseDto | null> {
        const order = (await this.orderRepository.findById(
            id
        )) as OrderWithDetails | null
        if (!order) {
            return null
        }
        return this.mapToResponseDto(order)
    }

    async getAllOrders(params?: {
        skip?: number
        take?: number
        userId?: string
        status?: string
    }): Promise<OrderResponseDto[]> {
        const { skip, take, userId, status } = params || {}

        const where: any = {}

        if (userId) {
            where.userId = userId
        }

        if (status) {
            where.status = status
        }

        const orders = (await this.orderRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        })) as OrderWithDetails[]

        return orders.map((order) => this.mapToResponseDto(order))
    }

    async updateOrder(
        id: string,
        updateOrderDto: UpdateOrderDto
    ): Promise<OrderResponseDto> {
        const order = (await this.orderRepository.update(
            id,
            updateOrderDto
        )) as OrderWithDetails
        return this.mapToResponseDto(order)
    }

    async deleteOrder(id: string): Promise<void> {
        await this.orderRepository.delete(id)
    }

    async getOrdersCount(params?: {
        userId?: string
        status?: string
    }): Promise<number> {
        const { userId, status } = params || {}

        const where: any = {}

        if (userId) {
            where.userId = userId
        }

        if (status) {
            where.status = status
        }

        return this.orderRepository.count(where)
    }

    private mapToResponseDto(order: OrderWithDetails): OrderResponseDto {
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            total: order.total,
            orderItems: order.orderItems.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                },
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        }
    }
}
