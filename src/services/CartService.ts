import { uowWrapper } from '@/utils/uowWrapper'
import { ICart } from '../../../client/src/types/ICart'

export class CartService {
    async getCart(userId: string) {
        return uowWrapper(async (uow) => {
            let cart = await uow.cartRepository.findCartByUserId(userId)

            if (!cart) {
                return null
            }

            // Filter out products that no longer exist
            const validProducts = cart.products.filter(
                (item) => item.product !== null
            )

            // If products were removed, update cart
            if (validProducts.length !== cart.products.length) {
                cart.products = validProducts
                cart.totalQuantity = validProducts.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                )
                await uow.cartRepository.updateCart(cart)
            }

            return cart
        })
    }

    async addToCart(userId: string, productId: string, quantity: number) {
        return uowWrapper(async (uow) => {
            // Find product
            const product = await uow.cartRepository.getProductById(productId)
            if (!product) {
                throw new Error('Product not found')
            }

            // Find or create cart
            let cart = await uow.cartRepository.findCartByUserId(userId)
            if (!cart) {
                cart = await uow.cartRepository.createCart(userId)
            }

            // Add product to cart or update quantity
            const existingProduct = cart.products.find(
                (item) => item.product.toString() === productId
            )

            if (existingProduct) {
                existingProduct.quantity += quantity
            } else {
                cart.products.push({
                    product: {
                        _id: product._id.toString(),
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl ?? '',
                    },
                    quantity,
                })
            }

            // Update totals
            cart.totalQuantity = cart.products.reduce(
                (total, item) => total + item.quantity,
                0
            )

            cart.totalPrice = cart.products.reduce(
                (total, item) =>
                    total + item.quantity * (item.product?.price || 0),
                0
            )

            await uow.cartRepository.updateCart(cart)
            return cart
        })
    }

    async updateCartItem(userId: string, productId: string, quantity: number) {
        return uowWrapper(async (uow) => {
            const cart = await uow.cartRepository.findCartByUserId(userId)
            if (!cart) {
                throw new Error('Cart not found')
            }

            const existingProduct = cart.products.find(
                (item) => item.product.toString() === productId
            )

            if (!existingProduct) {
                throw new Error('Product not found in cart')
            }

            existingProduct.quantity = quantity

            // Update totals
            cart.totalQuantity = cart.products.reduce(
                (total, item) => total + item.quantity,
                0
            )

            cart.totalPrice = cart.products.reduce(
                (total, item) =>
                    total + item.quantity * (item.product?.price || 0),
                0
            )

            await uow.cartRepository.updateCart(cart)
            return cart
        })
    }

    async removeFromCart(userId: string, productId: string) {
        return uowWrapper(async (uow) => {
            const cart = await uow.cartRepository.findCartByUserId(userId)
            if (!cart) {
                throw new Error('Cart not found')
            }

            cart.products = cart.products.filter(
                (item) => item.product.toString() !== productId
            )

            // Update totals
            cart.totalQuantity = cart.products.reduce(
                (total, item) => total + item.quantity,
                0
            )

            cart.totalPrice = cart.products.reduce(
                (total, item) =>
                    total + item.quantity * (item.product?.price || 0),
                0
            )

            await uow.cartRepository.updateCart(cart)
            return cart
        })
    }

    async clearCart(userId: string) {
        return uowWrapper(async (uow) => {
            const cart = await uow.cartRepository.findCartByUserId(userId)
            if (!cart) {
                throw new Error('Cart not found')
            }

            cart.products = []
            cart.totalQuantity = 0
            cart.totalPrice = 0

            await uow.cartRepository.updateCart(cart)
            return cart
        })
    }
}
