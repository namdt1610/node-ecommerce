import { OrderController } from './presentation/controllers/order.controller'
import { OrderTrackingController } from './presentation/controllers/order-tracking.controller'
import { CreateOrderUseCase } from './application/use-cases/create-order.usecase'
import { GetOrderByIdUseCase } from './application/use-cases/get-order-by-id.usecase'
import { GetOrdersByUserUseCase } from './application/use-cases/get-orders-by-user.usecase'
import { UpdateOrderUseCase } from './application/use-cases/update-order.usecase'
import { PrismaOrderRepository } from './infrastructure/repositories/prisma-order.repository'
import { OrderTrackingService } from './infrastructure/services/order-tracking.service'
import { IOrderRepository } from './domain/interfaces/order-repository.interface'
import { Server as SocketIOServer } from 'socket.io'

export interface OrderContainer {
    orderRepository: IOrderRepository
    createOrderUseCase: CreateOrderUseCase
    getOrderByIdUseCase: GetOrderByIdUseCase
    getOrdersByUserUseCase: GetOrdersByUserUseCase
    updateOrderUseCase: UpdateOrderUseCase
    orderController: OrderController
    orderTrackingService?: OrderTrackingService
    orderTrackingController?: OrderTrackingController
}

export function createOrderContainer(io?: SocketIOServer): OrderContainer {
    // Repository
    const orderRepository = new PrismaOrderRepository()

    // Use Cases
    const createOrderUseCase = new CreateOrderUseCase(orderRepository)
    const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository)
    const getOrdersByUserUseCase = new GetOrdersByUserUseCase(orderRepository)
    const updateOrderUseCase = new UpdateOrderUseCase(orderRepository)

    // Controller
    const orderController = new OrderController(
        createOrderUseCase,
        getOrderByIdUseCase,
        getOrdersByUserUseCase,
        updateOrderUseCase
    )

    // Tracking Service and Controller (optional, requires Socket.IO)
    let orderTrackingService: OrderTrackingService | undefined
    let orderTrackingController: OrderTrackingController | undefined

    if (io) {
        orderTrackingService = new OrderTrackingService(io, orderRepository)
        orderTrackingController = new OrderTrackingController(
            orderTrackingService
        )
    }

    return {
        orderRepository,
        createOrderUseCase,
        getOrderByIdUseCase,
        getOrdersByUserUseCase,
        updateOrderUseCase,
        orderController,
        orderTrackingService,
        orderTrackingController,
    }
}
