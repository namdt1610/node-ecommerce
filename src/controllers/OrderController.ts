import { NextFunction, Request, Response } from 'express'
import { OrderService } from '@/services/OrderService'

// filepath: c:\Users\Apple\Documents\GitHub\mern\server\src\controllers\OrderController.ts

class OrderController {
    private orderService: OrderService

    constructor() {
        this.orderService = new OrderService()
        this.getOrderById = this.getOrderById.bind(this)
        this.getAllOrders = this.getAllOrders.bind(this)
        this.getUserOrders = this.getUserOrders.bind(this)
        this.createOrder = this.createOrder.bind(this)
        this.updateOrder = this.updateOrder.bind(this)
        this.updateOrderStatus = this.updateOrderStatus.bind(this)
        this.deleteOrder = this.deleteOrder.bind(this)
    }

    async getOrderById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const orderId = req.params.id
            const order = await this.orderService.findOrderById(orderId)
            res.json(order)
        } catch (error) {
            next(error)
        }
    }

    async getOrdersByUserId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.id
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            
            const result = await this.orderService.getUserOrders(userId, page, limit)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllOrders(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const filters = req.query.filters ? JSON.parse(req.query.filters as string) : {}
            
            const result = await this.orderService.getAllOrders(page, limit, filters)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async getUserOrders(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.userId
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            
            const result = await this.orderService.getUserOrders(userId, page, limit)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async createOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const orderData = req.body
            const newOrder = await this.orderService.createOrder(orderData)
            res.status(201).json(newOrder)
        } catch (error) {
            next(error)
        }
    }

    async updateOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const orderId = req.params.id
            const updateData = req.body
            const updatedOrder = await this.orderService.updateOrder(orderId, updateData)
            res.json(updatedOrder)
        } catch (error) {
            next(error)
        }
    }

    async updateOrderStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const orderId = req.params.id
            const { status } = req.body
            const updatedOrder = await this.orderService.updateOrderStatus(orderId, status)
            res.json(updatedOrder)
        } catch (error) {
            next(error)
        }
    }

    async deleteOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const orderId = req.params.id
            const result = await this.orderService.deleteOrder(orderId)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default new OrderController()