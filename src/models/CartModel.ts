import mongoose from 'mongoose'
import { ICart } from '../../../client/src/types/ICart'

const Schema = mongoose.Schema

const cartSchema = new Schema<ICart>(
    {
        user: {
            type: String,
            ref: 'User',
            required: true,
        },
        products: [
            {
                product: {
                    type: String,
                    ref: 'Product',
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
            },
        ],
        totalQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
)

// Middleware: Tự động cập nhật totalQuantity và totalPrice trước khi lưu
cartSchema.pre('save', async function (next) {
    this.totalQuantity = this.products.reduce(
        (sum, item) => sum + item.quantity,
        0
    )
    next()

    // Nếu muốn tính totalPrice, cần populate product để lấy giá
    const ProductModel = mongoose.model('Product') // Đảm bảo đã import model Product
    const productIds = this.products.map((item) => item.product)

    const products = await ProductModel.find({ _id: { $in: productIds } })

    this.totalPrice = this.products.reduce((sum, item) => {
        const product = products.find(
            (p) => p._id.toString() === item.product.toString()
        )
        return sum + (product ? product.price * item.quantity : 0)
    }, 0)

    next()
})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
