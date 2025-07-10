import { Server as SocketIOServer } from 'socket.io'
import { IOrderRepository } from '../../domain/order/order-repository.interface'
import {
    Order,
    OrderStatus,
    ShippingStatus,
} from '../../domain/entities/order.entity'

export interface OrderTrackingUpdate {
    orderId: string
    status: OrderStatus
    shippingStatus: ShippingStatus
    location?: string
    message?: string
    timestamp: Date
    trackingNumber?: string
    estimatedDelivery?: Date
}

export interface OrderTrackingHistory {
    id: string
    orderId: string
    status: OrderStatus
    shippingStatus: ShippingStatus
    location?: string
    message: string
    timestamp: Date
}

export class OrderTrackingService {
    private io: SocketIOServer
    private orderRepository: IOrderRepository
    private trackingHistory: Map<string, OrderTrackingHistory[]> = new Map()

    constructor(io: SocketIOServer, orderRepository: IOrderRepository) {
        this.io = io
        this.orderRepository = orderRepository
        this.initializeTrackingData()
    }

    private async initializeTrackingData() {
        // Initialize with some mock tracking data for existing orders
        // In a real app, this would come from a shipping provider API
        const mockTrackingData: Record<string, OrderTrackingHistory[]> = {
            // This would be populated with real tracking data
        }

        for (const [orderId, history] of Object.entries(mockTrackingData)) {
            this.trackingHistory.set(orderId, history)
        }
    }

    async updateOrderStatus(update: OrderTrackingUpdate): Promise<void> {
        try {
            // Update order in database
            await this.orderRepository.update(update.orderId, {
                status: update.status,
                shippingStatus: update.shippingStatus,
                trackingNumber: update.trackingNumber,
                estimatedDelivery: update.estimatedDelivery,
            })

            // Add to tracking history
            const history = this.trackingHistory.get(update.orderId) || []
            const newEntry: OrderTrackingHistory = {
                id: `${update.orderId}-${Date.now()}`,
                orderId: update.orderId,
                status: update.status,
                shippingStatus: update.shippingStatus,
                location: update.location,
                message:
                    update.message ||
                    this.getDefaultMessage(
                        update.status,
                        update.shippingStatus
                    ),
                timestamp: update.timestamp,
            }

            history.push(newEntry)
            this.trackingHistory.set(update.orderId, history)

            // Emit real-time update to clients tracking this order
            this.io
                .to(`order-${update.orderId}`)
                .emit('order:tracking-update', {
                    orderId: update.orderId,
                    status: update.status,
                    shippingStatus: update.shippingStatus,
                    location: update.location,
                    message: newEntry.message,
                    timestamp: update.timestamp,
                    trackingNumber: update.trackingNumber,
                    estimatedDelivery: update.estimatedDelivery,
                    history: history,
                })

            // Also emit to user's personal room
            const order = await this.orderRepository.findById(update.orderId)
            if (order) {
                this.io
                    .to(`user-${order.userId}`)
                    .emit('order:status-changed', {
                        orderId: update.orderId,
                        status: update.status,
                        shippingStatus: update.shippingStatus,
                        message: newEntry.message,
                        timestamp: update.timestamp,
                    })
            }

            console.log(
                `Order ${update.orderId} status updated to ${update.status}`
            )
        } catch (error) {
            console.error('Error updating order status:', error)
            throw error
        }
    }

    async getOrderTracking(orderId: string): Promise<{
        order: Order | null
        history: OrderTrackingHistory[]
    }> {
        const order = await this.orderRepository.findById(orderId)
        const history = this.trackingHistory.get(orderId) || []

        // If no history exists, create initial entry
        if (history.length === 0 && order) {
            const initialEntry: OrderTrackingHistory = {
                id: `${orderId}-initial`,
                orderId,
                status: order.status,
                shippingStatus: order.shippingStatus,
                message: 'Đơn hàng đã được tạo',
                timestamp: order.createdAt,
            }
            history.push(initialEntry)
            this.trackingHistory.set(orderId, history)
        }

        return { order, history }
    }

    private getDefaultMessage(
        status: OrderStatus,
        shippingStatus: ShippingStatus
    ): string {
        switch (shippingStatus) {
            case ShippingStatus.NOT_SHIPPED:
                return 'Đơn hàng đang được chuẩn bị'
            case ShippingStatus.PREPARING:
                return 'Đang chuẩn bị hàng hóa'
            case ShippingStatus.SHIPPED:
                return 'Đơn hàng đã được giao cho đơn vị vận chuyển'
            case ShippingStatus.IN_TRANSIT:
                return 'Đơn hàng đang trên đường giao đến bạn'
            case ShippingStatus.OUT_FOR_DELIVERY:
                return 'Đơn hàng đang được giao'
            case ShippingStatus.DELIVERED:
                return 'Đơn hàng đã được giao thành công'
            case ShippingStatus.DELIVERY_FAILED:
                return 'Giao hàng thất bại, sẽ thử lại sau'
            default:
                switch (status) {
                    case OrderStatus.PENDING:
                        return 'Đơn hàng đang chờ xử lý'
                    case OrderStatus.CONFIRMED:
                        return 'Đơn hàng đã được xác nhận'
                    case OrderStatus.PROCESSING:
                        return 'Đơn hàng đang được xử lý'
                    case OrderStatus.CANCELLED:
                        return 'Đơn hàng đã bị hủy'
                    default:
                        return 'Cập nhật trạng thái đơn hàng'
                }
        }
    }

    // Simulate order tracking updates (for demo purposes)
    async simulateOrderProgress(orderId: string): Promise<void> {
        const order = await this.orderRepository.findById(orderId)
        if (!order) return

        const progressSteps = [
            {
                status: OrderStatus.CONFIRMED,
                shippingStatus: ShippingStatus.NOT_SHIPPED,
                message: 'Đơn hàng đã được xác nhận',
                delay: 2000,
            },
            {
                status: OrderStatus.PROCESSING,
                shippingStatus: ShippingStatus.PREPARING,
                message: 'Đang chuẩn bị hàng hóa',
                location: 'Kho hàng Hà Nội',
                delay: 3000,
            },
            {
                status: OrderStatus.SHIPPED,
                shippingStatus: ShippingStatus.SHIPPED,
                message: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
                location: 'Trung tâm phân loại Hà Nội',
                delay: 4000,
            },
            {
                status: OrderStatus.SHIPPED,
                shippingStatus: ShippingStatus.IN_TRANSIT,
                message: 'Đơn hàng đang trên đường giao đến bạn',
                location: 'Trung tâm phân loại TP.HCM',
                delay: 5000,
            },
            {
                status: OrderStatus.SHIPPED,
                shippingStatus: ShippingStatus.OUT_FOR_DELIVERY,
                message: 'Đơn hàng đang được giao',
                location: 'Bưu cục Quận 1',
                delay: 3000,
            },
            {
                status: OrderStatus.DELIVERED,
                shippingStatus: ShippingStatus.DELIVERED,
                message: 'Đơn hàng đã được giao thành công',
                location: 'Địa chỉ giao hàng',
                delay: 0,
            },
        ]

        for (const step of progressSteps) {
            await new Promise((resolve) => setTimeout(resolve, step.delay))

            await this.updateOrderStatus({
                orderId,
                status: step.status,
                shippingStatus: step.shippingStatus,
                location: step.location,
                message: step.message,
                timestamp: new Date(),
                trackingNumber: `VN${orderId.slice(-6).toUpperCase()}`,
                estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            })
        }
    }
}
