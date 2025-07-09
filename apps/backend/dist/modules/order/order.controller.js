"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const zod_1 = require("zod");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async createOrder(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                });
                return;
            }
            // Modify the request body to include the authenticated user's ID
            const orderData = {
                ...req.body,
                userId: req.user.id,
            };
            const createOrderDto = create_order_dto_1.CreateOrderSchema.parse(orderData);
            const order = await this.orderService.createOrder(createOrderDto);
            res.status(201).json({
                success: true,
                data: order,
                message: 'Order created successfully',
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            next(error);
        }
    }
    async getOrderById(req, res, next) {
        try {
            const { id } = req.params;
            const order = await this.orderService.getOrderById(id);
            if (!order) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
                return;
            }
            // Check if the order belongs to the authenticated user
            if (order.userId !== req.user?.id) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied',
                });
                return;
            }
            res.json({
                success: true,
                data: order,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllOrders(req, res, next) {
        try {
            const { page = '1', limit = '10', status = '' } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const take = Number(limit);
            // Filter orders by authenticated user
            const orders = await this.orderService.getAllOrders({
                skip,
                take,
                userId: req.user?.id,
                status: status || undefined,
            });
            const total = await this.orderService.getOrdersCount({
                userId: req.user?.id,
                status: status || undefined,
            });
            res.json({
                success: true,
                data: orders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateOrder(req, res, next) {
        try {
            const { id } = req.params;
            // Check if order exists and belongs to user
            const existingOrder = await this.orderService.getOrderById(id);
            if (!existingOrder) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
                return;
            }
            if (existingOrder.userId !== req.user?.id) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied',
                });
                return;
            }
            const updateOrderDto = update_order_dto_1.UpdateOrderSchema.parse(req.body);
            const order = await this.orderService.updateOrder(id, updateOrderDto);
            res.json({
                success: true,
                data: order,
                message: 'Order updated successfully',
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            next(error);
        }
    }
    async deleteOrder(req, res, next) {
        try {
            const { id } = req.params;
            // Check if order exists and belongs to user
            const existingOrder = await this.orderService.getOrderById(id);
            if (!existingOrder) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
                return;
            }
            if (existingOrder.userId !== req.user?.id) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied',
                });
                return;
            }
            await this.orderService.deleteOrder(id);
            res.json({
                success: true,
                message: 'Order deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status) {
                res.status(400).json({
                    success: false,
                    message: 'Status is required',
                });
                return;
            }
            // Check if order exists and belongs to user
            const existingOrder = await this.orderService.getOrderById(id);
            if (!existingOrder) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
                return;
            }
            if (existingOrder.userId !== req.user?.id) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied',
                });
                return;
            }
            const order = await this.orderService.updateOrder(id, { status });
            res.json({
                success: true,
                data: order,
                message: 'Order status updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
