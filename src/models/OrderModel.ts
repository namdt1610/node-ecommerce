import mongoose, { Schema, Document } from 'mongoose'
import { Order } from '../../../client/src/types/Order'

// export interface IOrder extends Document{
//     _id: string
// }

const orderSchema = new Schema<Order>(
    {
        user: {
            type: String,
            required: true,
            ref: 'User',
        },
        orderItems: [
            {
                product: { type: String, required: true, ref: 'Product' },
                image: { type: String },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            ward: { type: String, required: true },
            district: { type: String, required: true },
            province: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            required: true,
            enum: [
                'pending',
                'processing',
                'shipped',
                'completed',
                'cancelled',
            ],
            default: 'pending',
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
)

const Order = mongoose.model<Order>('Order', orderSchema)

export default Order
