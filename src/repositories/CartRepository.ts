import mongoose from 'mongoose'
import Cart from '@/models/CartModel'
import Product from '@/models/ProductModel'

export class CartRepository {
    private session: mongoose.ClientSession | null = null

    setSession(session: mongoose.ClientSession) {
        this.session = session
    }

    async findCartByUserId(userId: string) {
        return Cart.findOne({ user: userId })
            .populate('products.product')
            .session(this.session as any)
    }

    async createCart(userId: string) {
        const cart = new Cart({
            user: userId,
            products: [],
            totalPrice: 0,
            totalQuantity: 0,
        })
        return cart.save({ session: this.session })
    }

    async updateCart(cart: any) {
        return cart.save({ session: this.session })
    }

    async getProductById(productId: string) {
        return Product.findById(
            productId,
            'name price _id imageUrl stock'
        ).session(this.session as any)
    }
}
