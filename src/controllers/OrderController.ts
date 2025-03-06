import { Request, Response } from 'express'
import Order from '../models/OrderModel'
import Inventory from '../models/InventoryModel'
import InventoryActivity from '../models/InventoryActivityModel'
import mongoose from 'mongoose'
import User from '../models/UserModel'
import { sendEmail } from '../utils/sendEmail'
import { UnitOfWork } from '@/repositories/unitOfWork'
import { OrderService } from '@/services/orderService'

const orderService = new OrderService()

export const OrderController = {
    getAllOrders: async (req: Request, res: Response): Promise<void> => {
        try {
            const cacheKey = 'orders:all'

            const orders = await Order.find().populate('user', 'name')
            console.log('Orders: ', orders)
            res.status(200).json(orders)
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error fetching orders',
                error: error.message,
            })
            return
        }
    },

    getOrderById: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id

            const order = await Order.findById(req.params.id).populate({
                path: 'user',
                select: 'name phone email',
            })
            console.log('Oder: ', order)
            if (!order) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                })
                return
            }
            res.status(200).json(order)
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error fetching order',
                error: error.message,
            })
            return
        }
    },

    getOrdersByUserId: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id

            const orders = await Order.find({ id }).populate({
                path: 'user',
                select: 'name phone email',
            })
            if (!orders) {
                res.status(404).json({ message: 'Orders not found' })
                return
            }

            res.status(200).json(orders)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching orders',
                error,
            })
            return
        }
    },

    createOrder: async (req: Request, res: Response) => {
        const uow = new UnitOfWork()
        await uow.start()

        try {
            const userId = req.body.user
            const order = await orderService.createOrder(userId, req.body, uow)

            await uow.commit()
            res.status(201).json({
                success: true,
                message: 'Order created successfully!',
                order,
            })
        } catch (error: any) {
            await uow.rollback()
            res.status(500).json({ success: false, message: error.message })
        }
    },

    updateOrder: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true }
            )
            if (!updatedOrder) {
                res.status(404).json({
                    success: false,
                    message: 'Order not found',
                })
            }

            res.status(200).json({
                success: true,
                message: 'Order updated successfully',
                updatedOrder,
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error updating order',
                error: error.message,
            })
        }
    },

    updateOrderStatus: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { $set: { status: req.body.status } },
                { new: true }
            )
            if (!updatedOrder) {
                res.status(404).json({ message: 'Order not found' })
            }

            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                updatedOrder,
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error updating order status',
                error: error.message,
            })
        }
    },

    deleteOrder: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id
            const deletedOrder = await Order.findByIdAndDelete(id)
            if (!deletedOrder) {
                res.status(404).json({ message: 'Order not found' })
            }

            res.status(200).json({
                success: true,
                message: 'Order deleted successfully',
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error deleting order',
                error: error.message,
            })
        }
    },
}

export default OrderController
