import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
})

export const Token = mongoose.model('Token', TokenSchema)
