// =================================
// ORDER TYPES - CONSOLIDATED
// =================================

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED',
    REFUNDED = 'REFUNDED',
}

export enum ShippingStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    IN_TRANSIT = 'IN_TRANSIT',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    DELIVERED = 'DELIVERED',
    FAILED_DELIVERY = 'FAILED_DELIVERY',
    RETURNED = 'RETURNED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

// Core Order interface (standardized)
export interface Order {
    id: string
    userId: string
    orderNumber?: string
    status: OrderStatus | string // Allow string for backward compatibility
    shippingStatus?: ShippingStatus | string
    paymentStatus?: PaymentStatus | string
    items: OrderItem[]
    total: number
    subtotal?: number
    shipping?: number
    tax?: number
    shippingAddress?: string
    paymentMethod?: string
    trackingNumber?: string
    estimatedDelivery?: string | Date
    notes?: string
    createdAt: string | Date
    updatedAt: string | Date
}

export interface OrderItem {
    id: string
    orderId?: string
    productId: string
    quantity: number
    price: number // Unit price
    unitPrice?: number // Alias for compatibility
    total?: number // Calculated total for this item
    product?: {
        id: string
        name: string
        imageUrl?: string
        category?: {
            id: string
            name: string
        }
    }
}

// Tracking related interfaces
export interface TrackingHistoryItem {
    id: string
    orderId: string
    status: OrderStatus | string
    shippingStatus?: ShippingStatus | string
    location?: string
    message: string
    timestamp: string | Date
    metadata?: Record<string, unknown>
}

export interface OrderTracking {
    order: Order
    trackingHistory: TrackingHistoryItem[]
    estimatedDelivery?: string | Date
    currentLocation?: string
}

// API request/response types
export interface CreateOrderRequest {
    items: Array<{
        productId: string
        quantity: number
        price?: number
    }>
    shippingAddress?: string
    paymentMethod?: string
    notes?: string
}

export interface UpdateOrderRequest {
    status?: OrderStatus
    shippingStatus?: ShippingStatus
    paymentStatus?: PaymentStatus
    trackingNumber?: string
    estimatedDelivery?: string
    notes?: string
}

// Backend response mapping (for API compatibility)
export interface BackendOrderItem {
    id: string
    productId: string
    productName: string
    unitPrice: number
    price: number
    quantity: number
}

export interface BackendOrder {
    id: string
    userId: string
    status: string
    total: number
    items?: BackendOrderItem[]
    createdAt: string
    updatedAt: string
}
