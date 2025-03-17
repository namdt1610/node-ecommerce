import { sendOrderConfirmationEmail } from '@/utils/sendEmail'
import { uowWrapper } from '@/utils/uowWrapper'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\services\OrderService.ts

export class OrderService {
    async findOrderById(orderId: string) {
        return uowWrapper(async (uow) => {
            const order = await uow.orderRepository.findById(orderId)
            if (!order) throw new OrderError('Order not found', 404)
            return order
        })
    }

    async getAllOrders(page = 1, limit = 10, filters = {}) {
        return uowWrapper(async (uow) => {
            const orders = await uow.orderRepository.findAll(
                page,
                limit,
                filters
            )
            const total = await uow.orderRepository.countOrders(filters)
            return {
                orders,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            }
        })
    }

    async getUserOrders(userId: string, page = 1, limit = 10) {
        return uowWrapper(async (uow) => {
            const orders = await uow.orderRepository.findByUser(
                userId,
                page,
                limit
            )
            const total = await uow.orderRepository.countOrders({
                user: userId,
            })
            return {
                orders,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            }
        })
    }

    async createOrder(orderData: any) {
        return uowWrapper(async (uow) => {
            // Add any business logic/validation here
            const order = await uow.orderRepository.createOrder(orderData)
            await sendOrderConfirmationEmail(
                order.user.email,
                order._id,
                order.items,
                order.totalPrice
            )

            return order
        })
    }

    async updateOrder(orderId: string, updateData: any) {
        return uowWrapper(async (uow) => {
            const order = await uow.orderRepository.findById(orderId)
            if (!order) throw new OrderError('Order not found', 404)

            const updatedOrder = await uow.orderRepository.updateOrder(
                orderId,
                updateData
            )
            return updatedOrder
        })
    }

    async updateOrderStatus(orderId: string, status: string) {
        return uowWrapper(async (uow) => {
            const order = await uow.orderRepository.findById(orderId)
            if (!order) throw new OrderError('Order not found', 404)

            const updatedOrder = await uow.orderRepository.updateOrderStatus(
                orderId,
                status
            )
            return updatedOrder
        })
    }

    async deleteOrder(orderId: string) {
        return uowWrapper(async (uow) => {
            const order = await uow.orderRepository.findById(orderId)
            if (!order) throw new OrderError('Order not found', 404)

            await uow.orderRepository.deleteOrder(orderId)
            return { message: 'Order deleted successfully' }
        })
    }
}

class OrderError extends Error {
    statusCode: number

    constructor(message: string, statusCode = 400) {
        super(message)
        this.name = 'OrderError'
        this.statusCode = statusCode

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OrderError)
        }
    }
}
