"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTrackingService = void 0;
const order_entity_1 = require("../../domain/entities/order.entity");
class OrderTrackingService {
    io;
    orderRepository;
    trackingHistory = new Map();
    constructor(io, orderRepository) {
        this.io = io;
        this.orderRepository = orderRepository;
        this.initializeTrackingData();
    }
    async initializeTrackingData() {
        // Initialize with some mock tracking data for existing orders
        // In a real app, this would come from a shipping provider API
        const mockTrackingData = {
        // This would be populated with real tracking data
        };
        for (const [orderId, history] of Object.entries(mockTrackingData)) {
            this.trackingHistory.set(orderId, history);
        }
    }
    async updateOrderStatus(update) {
        try {
            // Update order in database
            await this.orderRepository.update(update.orderId, {
                status: update.status,
                shippingStatus: update.shippingStatus,
                trackingNumber: update.trackingNumber,
                estimatedDelivery: update.estimatedDelivery,
            });
            // Add to tracking history
            const history = this.trackingHistory.get(update.orderId) || [];
            const newEntry = {
                id: `${update.orderId}-${Date.now()}`,
                orderId: update.orderId,
                status: update.status,
                shippingStatus: update.shippingStatus,
                location: update.location,
                message: update.message ||
                    this.getDefaultMessage(update.status, update.shippingStatus),
                timestamp: update.timestamp,
            };
            history.push(newEntry);
            this.trackingHistory.set(update.orderId, history);
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
            });
            // Also emit to user's personal room
            const order = await this.orderRepository.findById(update.orderId);
            if (order) {
                this.io
                    .to(`user-${order.userId}`)
                    .emit('order:status-changed', {
                    orderId: update.orderId,
                    status: update.status,
                    shippingStatus: update.shippingStatus,
                    message: newEntry.message,
                    timestamp: update.timestamp,
                });
            }
            console.log(`Order ${update.orderId} status updated to ${update.status}`);
        }
        catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
    async getOrderTracking(orderId) {
        const order = await this.orderRepository.findById(orderId);
        const history = this.trackingHistory.get(orderId) || [];
        // If no history exists, create initial entry
        if (history.length === 0 && order) {
            const initialEntry = {
                id: `${orderId}-initial`,
                orderId,
                status: order.status,
                shippingStatus: order.shippingStatus,
                message: 'Đơn hàng đã được tạo',
                timestamp: order.createdAt,
            };
            history.push(initialEntry);
            this.trackingHistory.set(orderId, history);
        }
        return { order, history };
    }
    getDefaultMessage(status, shippingStatus) {
        switch (shippingStatus) {
            case order_entity_1.ShippingStatus.NOT_SHIPPED:
                return 'Đơn hàng đang được chuẩn bị';
            case order_entity_1.ShippingStatus.PREPARING:
                return 'Đang chuẩn bị hàng hóa';
            case order_entity_1.ShippingStatus.SHIPPED:
                return 'Đơn hàng đã được giao cho đơn vị vận chuyển';
            case order_entity_1.ShippingStatus.IN_TRANSIT:
                return 'Đơn hàng đang trên đường giao đến bạn';
            case order_entity_1.ShippingStatus.OUT_FOR_DELIVERY:
                return 'Đơn hàng đang được giao';
            case order_entity_1.ShippingStatus.DELIVERED:
                return 'Đơn hàng đã được giao thành công';
            case order_entity_1.ShippingStatus.DELIVERY_FAILED:
                return 'Giao hàng thất bại, sẽ thử lại sau';
            default:
                switch (status) {
                    case order_entity_1.OrderStatus.PENDING:
                        return 'Đơn hàng đang chờ xử lý';
                    case order_entity_1.OrderStatus.CONFIRMED:
                        return 'Đơn hàng đã được xác nhận';
                    case order_entity_1.OrderStatus.PROCESSING:
                        return 'Đơn hàng đang được xử lý';
                    case order_entity_1.OrderStatus.CANCELLED:
                        return 'Đơn hàng đã bị hủy';
                    default:
                        return 'Cập nhật trạng thái đơn hàng';
                }
        }
    }
    // Simulate order tracking updates (for demo purposes)
    async simulateOrderProgress(orderId) {
        const order = await this.orderRepository.findById(orderId);
        if (!order)
            return;
        const progressSteps = [
            {
                status: order_entity_1.OrderStatus.CONFIRMED,
                shippingStatus: order_entity_1.ShippingStatus.NOT_SHIPPED,
                message: 'Đơn hàng đã được xác nhận',
                delay: 2000,
            },
            {
                status: order_entity_1.OrderStatus.PROCESSING,
                shippingStatus: order_entity_1.ShippingStatus.PREPARING,
                message: 'Đang chuẩn bị hàng hóa',
                location: 'Kho hàng Hà Nội',
                delay: 3000,
            },
            {
                status: order_entity_1.OrderStatus.SHIPPED,
                shippingStatus: order_entity_1.ShippingStatus.SHIPPED,
                message: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
                location: 'Trung tâm phân loại Hà Nội',
                delay: 4000,
            },
            {
                status: order_entity_1.OrderStatus.SHIPPED,
                shippingStatus: order_entity_1.ShippingStatus.IN_TRANSIT,
                message: 'Đơn hàng đang trên đường giao đến bạn',
                location: 'Trung tâm phân loại TP.HCM',
                delay: 5000,
            },
            {
                status: order_entity_1.OrderStatus.SHIPPED,
                shippingStatus: order_entity_1.ShippingStatus.OUT_FOR_DELIVERY,
                message: 'Đơn hàng đang được giao',
                location: 'Bưu cục Quận 1',
                delay: 3000,
            },
            {
                status: order_entity_1.OrderStatus.DELIVERED,
                shippingStatus: order_entity_1.ShippingStatus.DELIVERED,
                message: 'Đơn hàng đã được giao thành công',
                location: 'Địa chỉ giao hàng',
                delay: 0,
            },
        ];
        for (const step of progressSteps) {
            await new Promise((resolve) => setTimeout(resolve, step.delay));
            await this.updateOrderStatus({
                orderId,
                status: step.status,
                shippingStatus: step.shippingStatus,
                location: step.location,
                message: step.message,
                timestamp: new Date(),
                trackingNumber: `VN${orderId.slice(-6).toUpperCase()}`,
                estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            });
        }
    }
}
exports.OrderTrackingService = OrderTrackingService;
