import mongoose from 'mongoose'

const schema = mongoose.Schema

const reviewSchema = new schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Review', reviewSchema)
