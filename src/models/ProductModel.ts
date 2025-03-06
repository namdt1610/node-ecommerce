import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        imageUrl: {
            type: String,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        clickCount: {
            type: Number,
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        author: {
            type: String,
        },
        favorites: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
)

const Product = mongoose.model('Product', productSchema)
export default Product
