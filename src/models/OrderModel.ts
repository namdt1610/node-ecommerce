import mongoose, { Schema, Document } from 'mongoose'
import { IUser } from './UserModel'

export interface OrderItems {
    product: string
    image: string
    name: string
    quantity: number
    price: number
}

export interface IOrder {
    _id: string
    user: IUser
    items: OrderItems[]
    shippingAddress: {
        address: string
        ward: string
        district: string
        province: string
    }
    paymentMethod: string
    paymentResult?: {
        _id?: string
        status?: string
        update_time?: string
        email_address?: string
    } | null
    itemsPrice: number
    taxPrice: number
    shippingPrice: number
    totalPrice: number
    status: string
    isPaid: boolean
    paidAt?: Date
    isDelivered: boolean
    deliveredAt?: Date
    createdAt: Date
}

export interface CreateOrderRequest {
    user: string
    orderItems: Array<{
        name: string
        quantity: number
        image: string
        price: number
        product: string
    }>
    shippingAddress: {
        address: string
        ward: string
        district: string
        province: string
    }
    paymentMethod: string
    itemsPrice: number
    taxPrice: number
    shippingPrice: number
    totalPrice: number
}

const orderSchema = new Schema<IOrder>(
    {
        user: {
            type: String,
            required: true,
            ref: 'User',
        },
        items: [
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

const Order = mongoose.model<IOrder>('Order', orderSchema)

export default Order
