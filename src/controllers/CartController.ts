import { NextFunction, Request, Response } from 'express'
import { CartService } from '@/services/CartService'
import { AddToCartRequest } from '../../../client/src/types/ICart'

class CartController {
    private cartService: CartService

    constructor() {
        this.cartService = new CartService()
        this.getCart = this.getCart.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.updateCartItem = this.updateCartItem.bind(this)
        this.removeFromCart = this.removeFromCart.bind(this)
        this.clearCart = this.clearCart.bind(this)
    }

    async getCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { userId } = req.params
            console.log('Finding cart for userId:', userId)

            const cart = await this.cartService.getCart(userId)

            if (!cart) {
                res.status(404).json({ message: 'Cart not found' })
                return
            }

            res.status(200).json(cart)
        } catch (error) {
            next(error)
        }
    }

    async addToCart(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { userId } = req.params
            const { product_id, quantity } = req.body as AddToCartRequest

            const cart = await this.cartService.addToCart(
                userId,
                product_id,
                quantity
            )

            res.status(200).json(cart)
        } catch (error) {
            next(error)
        }
    }

    async updateCartItem(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { userId } = req.params
            const { product_id, quantity } = req.body

            const cart = await this.cartService.updateCartItem(
                userId,
                product_id,
                quantity
            )

            res.status(200).json(cart)
        } catch (error) {
            next(error)
        }
    }

    async removeFromCart(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params
            const { product_id } = req.body

            const cart = await this.cartService.removeFromCart(
                userId,
                product_id
            )

            res.status(200).json(cart)
        } catch (error) {
            console.error('Error removing product from cart:', error)
            res.status(500).json({
                message: 'Error removing product from cart',
                error: (error as Error).message,
            })
        }
    }

    async clearCart(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params

            const cart = await this.cartService.clearCart(userId)

            res.status(200).json(cart)
        } catch (error) {
            console.error('Error clearing cart:', error)
            res.status(500).json({
                message: 'Error clearing cart',
                error: (error as Error).message,
            })
        }
    }
}

export default new CartController()
