import { Product } from './product'

export interface Order {
    id: string
    userId: string
    items: OrderItem[]
    total: number
    status: OrderStatus
    shippingAddress: string
    paymentMethod: string
    createdAt: string
    updatedAt: string
}

export interface OrderItem {
    id: string
    productId: string
    quantity: number
    price: number
    product?: Product
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export interface OrderData {
    items: Array<{
        productId: string
        quantity: number
        price: number
    }>
    shippingAddress: string
    paymentMethod: string
}
