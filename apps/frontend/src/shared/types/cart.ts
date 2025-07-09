import { Product } from './product'

export interface CartItem {
    id: string
    productId: string
    quantity: number
    price: number
    product?: Product
}

export interface Cart {
    id: string
    items: CartItem[]
    total: number
    userId?: string
}
