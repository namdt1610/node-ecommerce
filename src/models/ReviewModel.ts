import mongoose from 'mongoose'

interface IReview {
    productId: mongoose.Schema.Types.ObjectId
    userId: mongoose.Schema.Types.ObjectId
    rating: number
    comment: string
    createdAt: Date
}

const schema = mongoose.Schema

const reviewSchema = new schema<IReview>({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Review', reviewSchema)
