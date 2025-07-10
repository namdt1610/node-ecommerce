"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTrackingController = void 0;
class OrderTrackingController {
    orderTrackingService;
    constructor(orderTrackingService) {
        this.orderTrackingService = orderTrackingService;
    }
    // Get order tracking information
    async getOrderTracking(req, res, next) {
        try {
            const { orderId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }
            const trackingData = await this.orderTrackingService.getOrderTracking(orderId);
            if (!trackingData.order) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
                return;
            }
            // Check if user owns this order
            if (trackingData.order.userId !== userId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied',
                });
                return;
            }
            res.json({
                success: true,
                data: {
                    order: trackingData.order,
                    trackingHistory: trackingData.history,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Start order tracking simulation (for demo purposes)
    async startOrderTracking(req, res, next) {
        try {
            const { orderId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }
            const trackingData = await this.orderTrackingService.getOrderTracking(orderId);
            if (!trackingData.order) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
                return;
            }
            // Check if user owns this order
            if (trackingData.order.userId !== userId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied',
                });
                return;
            }
            // Start the tracking simulation
            this.orderTrackingService.simulateOrderProgress(orderId);
            res.json({
                success: true,
                message: 'Order tracking started',
                data: {
                    orderId,
                    message: 'Bắt đầu theo dõi đơn hàng real-time',
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Join order tracking room (for Socket.IO)
    async joinOrderTracking(req, res, next) {
        try {
            const { orderId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }
            const trackingData = await this.orderTrackingService.getOrderTracking(orderId);
            if (!trackingData.order) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
                return;
            }
            // Check if user owns this order
            if (trackingData.order.userId !== userId) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied',
                });
                return;
            }
            res.json({
                success: true,
                data: {
                    orderId,
                    socketRoom: `order-${orderId}`,
                    userRoom: `user-${userId}`,
                    message: 'Ready to join tracking room',
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderTrackingController = OrderTrackingController;
