import mongoose, { Schema, Document } from 'mongoose'

interface InventoryActivity extends Document {
    product: Schema.Types.ObjectId
    action: 'add' | 'remove' | 'update'
    quantity: number
    previousQuantity: number
    newQuantity: number
    updatedBy: Schema.Types.ObjectId | string
    createdAt: Date
    updatedAt: Date
}

const inventoryActivitySchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        action: {
            type: String,
            enum: ['add', 'remove', 'update'],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        previousQuantity: {
            type: Number,
            required: true,
        },
        newQuantity: {
            type: Number,
            required: true,
        },
        updatedBy: {
            type: Schema.Types.Mixed,
            default: 'system',
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: true },
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                ret.createdAt = ret.createdAt?.toISOString()
                ret.updatedAt = ret.updatedAt?.toISOString()
                return ret
            },
        },
    }
)

export default mongoose.model<InventoryActivity>(
    'InventoryActivity',
    inventoryActivitySchema
)
