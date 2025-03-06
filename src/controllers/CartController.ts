import { Request, Response } from 'express'
import Cart from '../models/CartModel'
import Product from '../models/ProductModel'
import { AddToCartRequest } from '../../../client/src/types/ICart'

// 1. Lấy thông tin giỏ hàng
export const getCart = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params
    console.log('Received userId from client:', userId)

    try {
        console.log('Finding cart for userId:', userId)
        const cart = await Cart.findOne({ user: userId }).populate(
            'products.product'
        )

        console.log('Cart data from user:', cart)
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' })
            return
        }

        // Kiểm tra sản phẩm nào không còn tồn tại
        const validProducts = cart.products.filter(
            (item) => item.product !== null
        )
        const removedProducts = cart.products.length - validProducts.length

        // Nếu có sản phẩm bị xóa, cập nhật giỏ hàng
        if (removedProducts > 0) {
            cart.products = validProducts
            cart.totalQuantity = cart.products.reduce(
                (sum, item) => sum + item.quantity,
                0
            )
            await cart.save()
        }

        res.setHeader(
            'X-Cart-Message',
            removedProducts > 0
                ? `${removedProducts} sản phẩm đã bị xóa khỏi giỏ hàng vì không còn tồn tại.`
                : ''
        )
        res.status(200).json(cart)
    } catch (error) {
        console.error('Error fetching cart:', error)
        res.status(500).json({
            message: 'Error fetching cart',
            error: (error as Error).message,
        })
    }
}

// 2. Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params
        const { product_id, quantity } = req.body as AddToCartRequest
        console.log(
            'Received userId:',
            userId,
            'product_id:',
            product_id,
            'quantity:',
            quantity
        )

        // Tìm sản phẩm trong database
        const product = await Product.findById(
            product_id,
            'name price _id imageUrl stock'
        )
        if (!product) {
            console.log('Product not found for productId:', product_id)
            res.status(404).json({ message: 'Product not found' })
            return
        }

        // Tìm giỏ hàng của user
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            console.log(
                'Cart not found, creating a new one for userId:',
                userId
            )
            cart = new Cart({
                user: userId,
                products: [],
                totalPrice: 0,
            })
        }

        // Tìm sản phẩm trong giỏ hàng
        const existingProduct = cart.products.find(
            (item) => item.product.toString() === product_id
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
        cart.totalQuantity = cart.products.reduce(
            (total, item) => total + item.quantity,
            0
        )

        // Tính lại tổng giá
        cart.totalPrice = cart.products.reduce((total, item) => {
            const itemPrice = item.quantity * (product?.price || 0)
            return total + itemPrice
        }, 0)
        console.log('Updated cart:', cart)

        await cart.save()
        res.status(200).json(cart)
    } catch (error) {
        console.error('Error adding product to cart:', error)
        res.status(500).json({
            message: 'Error adding product to cart',
            error: (error as Error).message,
        })
    }
}

// 3. Cập nhật số lượng sản phẩm
export const updateCartItem = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId, productId } = req.params
        console.log('Received userId:', userId, 'productId:', productId)
        const { quantity } = req.body

        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' })
            return
        }

        const productInCart = cart!.products.find(
            (item) => item.product.toString() === productId
        )
        if (!productInCart) {
            res.status(404).json({ message: 'Product not in cart' })
            return
        }

        productInCart!.quantity = quantity

        // Tính lại tổng giá và số lượng
        const product = await Product.findById(productId)
        cart!.totalQuantity = cart!.products.reduce(
            (total, item) => total + item.quantity,
            0
        )
        cart!.totalPrice = cart!.products.reduce((total, item) => {
            const itemPrice = item.quantity * (product?.price || 0)
            return total + itemPrice
        }, 0)

        await cart.save()
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({
            message: 'Error updating cart item',
            error: (error as Error).message,
        })
    }
}

// 4. Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId, productId } = req.params

        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' })
            return
        }

        cart.products = cart.products.filter(
            (item) => item.product.toString() !== productId
        )

        // Tính lại tổng giá
        const product = await Product.findById(productId)
        cart.totalPrice = cart.products.reduce((total, item) => {
            const itemPrice = item.quantity * (product?.price || 0)
            return total + itemPrice
        }, 0)

        await cart.save()

        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({
            message: 'Error removing product from cart',
            error: (error as Error).message,
        })
    }
}
