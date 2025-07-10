"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const zod_1 = require("zod");
const dto_1 = require("../../application/dto");
const validation_1 = require("../../../../utils/validation");
class OrderController {
    createOrderUseCase;
    getOrderByIdUseCase;
    getOrdersByUserUseCase;
    updateOrderUseCase;
    constructor(createOrderUseCase, getOrderByIdUseCase, getOrdersByUserUseCase, updateOrderUseCase) {
        this.createOrderUseCase = createOrderUseCase;
        this.getOrderByIdUseCase = getOrderByIdUseCase;
        this.getOrdersByUserUseCase = getOrdersByUserUseCase;
        this.updateOrderUseCase = updateOrderUseCase;
    }
    async createOrder(req, res, next) {
        try {
            // Check authentication
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                });
                return;
            }
            // Validate user ID format
            if (!req.user.id || typeof req.user.id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user session',
                });
                return;
            }
            console.log('=== ORDER CREATION DEBUG ===', {
                userId: req.user.id,
                userIdType: typeof req.user.id,
                userIdLength: req.user.id.length,
                requestBody: req.body,
                bodyType: typeof req.body,
                bodyKeys: Object.keys(req.body || {}),
            });
            // Modify the request body to include the authenticated user's ID
            const orderData = {
                ...req.body,
                userId: req.user.id,
            };
            console.log('=== ORDER DATA BEFORE VALIDATION ===', {
                orderData,
                itemsCount: orderData.items?.length,
                firstItem: orderData.items?.[0],
            });
            // Pre-validate with detailed debugging
            try {
                (0, validation_1.validateOrderData)(orderData);
            }
            catch (validationError) {
                console.error('=== PRE-VALIDATION ERROR ===', validationError);
                res.status(400).json({
                    success: false,
                    message: 'Data validation failed',
                    error: validationError.message,
                });
                return;
            }
            // Validate the order data
            const createOrderDto = dto_1.CreateOrderSchema.parse(orderData);
            console.log('=== ORDER DATA AFTER VALIDATION ===', {
                createOrderDto,
                validatedItemsCount: createOrderDto.items.length,
            });
            const order = await this.createOrderUseCase.execute(createOrderDto);
            res.status(201).json({
                success: true,
                data: order,
                message: 'Order created successfully',
            });
        }
        catch (error) {
            console.error('=== ORDER CREATION ERROR ===', {
                error,
                errorType: error?.constructor?.name,
                errorMessage: error?.message,
                userId: req.user?.id,
                requestBody: req.body,
            });
            if (error instanceof zod_1.z.ZodError) {
                console.error('=== VALIDATION ERRORS ===', {
                    zodErrors: error.errors,
                    formattedErrors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                        value: err.code === 'invalid_type'
                            ? `received: ${err.received}, expected: ${err.expected}`
                            : undefined,
                    })),
                });
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
            const order = await this.getOrderByIdUseCase.execute(id);
            if (!order) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
                return;
            }
            // Check if order belongs to user (unless admin)
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
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                });
                return;
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const orders = await this.getOrdersByUserUseCase.execute(userId, {
                skip,
                take: limit,
            });
            res.json({
                success: true,
                data: orders,
                pagination: {
                    page,
                    limit,
                    total: orders.length,
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
            const existingOrder = await this.getOrderByIdUseCase.execute(id);
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
            const updateOrderDto = dto_1.UpdateOrderSchema.parse(req.body);
            const order = await this.updateOrderUseCase.execute(id, updateOrderDto);
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
}
exports.OrderController = OrderController;
