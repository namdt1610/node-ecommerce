import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.usecase'
import { GetCartUseCase } from '../../application/use-cases/get-cart.usecase'
import { UpdateCartItemUseCase } from '../../application/use-cases/update-cart-item.usecase'
import { RemoveFromCartUseCase } from '../../application/use-cases/remove-from-cart.usecase'
import { ClearCartUseCase } from '../../application/use-cases/clear-cart.usecase'
import { AddToCartSchema, UpdateCartItemSchema } from '../../application/dto'

interface AuthenticatedRequest extends Request {
    user?: {
        id: string
        email: string
    }
}

export class CartController {
    constructor(
        private addToCartUseCase: AddToCartUseCase,
        private getCartUseCase: GetCartUseCase,
        private updateCartItemUseCase: UpdateCartItemUseCase,
        private removeFromCartUseCase: RemoveFromCartUseCase,
        private clearCartUseCase: ClearCartUseCase
    ) {}

    async getCart(
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

            const cart = await this.getCartUseCase.execute(userId)

            res.json({
                success: true,
                data: cart || {
                    userId,
                    items: [],
                    totalItems: 0,
                    totalAmount: 0,
                    currency: 'USD',
                    updatedAt: new Date(),
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async addToCart(
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

            const addToCartDto = AddToCartSchema.parse(req.body)
            const cartItem = await this.addToCartUseCase.execute(
                userId,
                addToCartDto
            )

            res.status(201).json({
                success: true,
                data: cartItem,
                message: 'Item added to cart successfully',
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

    async updateCartItem(
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

            const { itemId } = req.params
            const updateCartItemDto = UpdateCartItemSchema.parse(req.body)
            const cartItem = await this.updateCartItemUseCase.execute(
                userId,
                itemId,
                updateCartItemDto
            )

            res.json({
                success: true,
                data: cartItem,
                message: 'Cart item updated successfully',
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

    async removeFromCart(
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

            const { itemId } = req.params
            await this.removeFromCartUseCase.execute(userId, itemId)

            res.json({
                success: true,
                message: 'Item removed from cart successfully',
            })
        } catch (error) {
            next(error)
        }
    }

    async clearCart(
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

            await this.clearCartUseCase.execute(userId)

            res.json({
                success: true,
                message: 'Cart cleared successfully',
            })
        } catch (error) {
            next(error)
        }
    }

    async getCartItemsCount(
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

            const cart = await this.getCartUseCase.execute(userId)
            const totalItems = cart?.totalItems || 0

            res.json({
                success: true,
                data: { totalItems },
            })
        } catch (error) {
            next(error)
        }
    }
}
