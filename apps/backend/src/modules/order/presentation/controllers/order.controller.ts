import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { CreateOrderUseCase } from '../../application/use-cases/create-order.usecase'
import { GetOrderByIdUseCase } from '../../application/use-cases/get-order-by-id.usecase'
import { GetOrdersByUserUseCase } from '../../application/use-cases/get-orders-by-user.usecase'
import { UpdateOrderUseCase } from '../../application/use-cases/update-order.usecase'
import { CreateOrderSchema, UpdateOrderSchema } from '../../application/dto'
import { validateOrderData, debugValue } from '../../../../utils/validation'

interface AuthenticatedRequest extends Request {
    user?: {
        id: string
        email: string
        name: string
        role: any
    }
}

export class OrderController {
    constructor(
        private createOrderUseCase: CreateOrderUseCase,
        private getOrderByIdUseCase: GetOrderByIdUseCase,
        private getOrdersByUserUseCase: GetOrdersByUserUseCase,
        private updateOrderUseCase: UpdateOrderUseCase
    ) {}

    async createOrder(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // Check authentication
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                })
                return
            }

            // Validate user ID format
            if (!req.user.id || typeof req.user.id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user session',
                })
                return
            }

            console.log('=== ORDER CREATION DEBUG ===', {
                userId: req.user.id,
                userIdType: typeof req.user.id,
                userIdLength: req.user.id.length,
                requestBody: req.body,
                bodyType: typeof req.body,
                bodyKeys: Object.keys(req.body || {}),
            })

            // Modify the request body to include the authenticated user's ID
            const orderData = {
                ...req.body,
                userId: req.user.id,
            }

            console.log('=== ORDER DATA BEFORE VALIDATION ===', {
                orderData,
                itemsCount: orderData.items?.length,
                firstItem: orderData.items?.[0],
            })

            // Pre-validate with detailed debugging
            try {
                validateOrderData(orderData)
            } catch (validationError: any) {
                console.error('=== PRE-VALIDATION ERROR ===', validationError)
                res.status(400).json({
                    success: false,
                    message: 'Data validation failed',
                    error: validationError.message,
                })
                return
            }

            // Validate the order data
            const createOrderDto = CreateOrderSchema.parse(orderData)

            console.log('=== ORDER DATA AFTER VALIDATION ===', {
                createOrderDto,
                validatedItemsCount: createOrderDto.items.length,
            })

            const order = await this.createOrderUseCase.execute(createOrderDto)

            res.status(201).json({
                success: true,
                data: order,
                message: 'Order created successfully',
            })
        } catch (error: any) {
            console.error('=== ORDER CREATION ERROR ===', {
                error,
                errorType: error?.constructor?.name,
                errorMessage: error?.message,
                userId: req.user?.id,
                requestBody: req.body,
            })

            if (error instanceof z.ZodError) {
                console.error('=== VALIDATION ERRORS ===', {
                    zodErrors: error.errors,
                    formattedErrors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                        value:
                            err.code === 'invalid_type'
                                ? `received: ${err.received}, expected: ${err.expected}`
                                : undefined,
                    })),
                })

                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                })
                return
            }
            next(error)
        }
    }

    async getOrderById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params
            const order = await this.getOrderByIdUseCase.execute(id)

            if (!order) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                })
                return
            }

            // Check if order belongs to user (unless admin)
            if (order.userId !== req.user?.id) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied',
                })
                return
            }

            res.json({
                success: true,
                data: order,
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllOrders(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.user?.id
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                })
                return
            }

            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const skip = (page - 1) * limit

            const orders = await this.getOrdersByUserUseCase.execute(userId, {
                skip,
                take: limit,
            })

            res.json({
                success: true,
                data: orders,
                pagination: {
                    page,
                    limit,
                    total: orders.length,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async updateOrder(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.params

            // Check if order exists and belongs to user
            const existingOrder = await this.getOrderByIdUseCase.execute(id)
            if (!existingOrder) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                })
                return
            }

            if (existingOrder.userId !== req.user?.id) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied',
                })
                return
            }

            const updateOrderDto = UpdateOrderSchema.parse(req.body)
            const order = await this.updateOrderUseCase.execute(
                id,
                updateOrderDto
            )

            res.json({
                success: true,
                data: order,
                message: 'Order updated successfully',
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                })
                return
            }
            next(error)
        }
    }
}
