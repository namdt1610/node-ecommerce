import mongoose from 'mongoose'

const Schema = mongoose.Schema

const warehouseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
)

const Warehouse = mongoose.model('Warehouse', warehouseSchema)
export default Warehouse
