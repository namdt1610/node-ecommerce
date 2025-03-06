import mongoose, { Document, Schema } from 'mongoose'

const schema = Schema

export interface ICategory extends Document {
    name: string
}

const categorySchema = new schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    productsCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    imgUrl: {
        type: String,
        default: '/beethoven.webp',
    },
})

const Category = mongoose.model('Category', categorySchema)
export default Category
