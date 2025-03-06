import mongoose, { Schema, Types } from 'mongoose'

interface IInventory extends Document {
    product: Types.ObjectId
    warehouse: Types.ObjectId
    quantity: number
    lastUpdated: Date
}

const InventorySchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            unique: true,
        },
        warehouse: {
            type: Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        autoIndex: true,
    }
)

// Drop any existing indexes and recreate only what we need
InventorySchema.index({ product: 1 }, { unique: true })

const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema)
export default Inventory
