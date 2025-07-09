export interface Order {
    id: string
    userId: string
    orderNumber: string
    status: OrderStatus
    paymentStatus: PaymentStatus
    shippingStatus: ShippingStatus
    items: OrderItem[]
    subtotal: number
    tax: number
    shipping: number
    discount: number
    total: number
    currency: string
    shippingAddress: ShippingAddress
    billingAddress: BillingAddress
    paymentMethod: PaymentMethod
    trackingNumber?: string
    estimatedDelivery?: Date
    deliveredAt?: Date
    notes?: string
    createdAt: Date
    updatedAt: Date
}

export interface OrderItem {
    id: string
    orderId: string
    productId: string
    productName: string
    productImage: string
    productSku: string
    model: string
    storage: string
    color: string
    unitPrice: number
    quantity: number
    totalPrice: number
}

export interface ShippingAddress {
    fullName: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault?: boolean
}

export interface BillingAddress {
    fullName: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault?: boolean
}

export interface PaymentMethod {
    type: PaymentType
    cardLast4?: string
    cardBrand?: string
    expiryMonth?: number
    expiryYear?: number
}

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

export enum PaymentStatus {
    PENDING = 'PENDING',
    AUTHORIZED = 'AUTHORIZED',
    CAPTURED = 'CAPTURED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export enum ShippingStatus {
    NOT_SHIPPED = 'NOT_SHIPPED',
    PREPARING = 'PREPARING',
    SHIPPED = 'SHIPPED',
    IN_TRANSIT = 'IN_TRANSIT',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    DELIVERED = 'DELIVERED',
    DELIVERY_FAILED = 'DELIVERY_FAILED',
}

export enum PaymentType {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    PAYPAL = 'PAYPAL',
    APPLE_PAY = 'APPLE_PAY',
    GOOGLE_PAY = 'GOOGLE_PAY',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export interface CreateOrderData {
    userId: string
    items: CreateOrderItemData[]
    shippingAddress: ShippingAddress
    billingAddress: BillingAddress
    paymentMethod: PaymentMethod
    notes?: string
}

export interface CreateOrderItemData {
    productId: string
    quantity: number
    unitPrice: number
}

export interface UpdateOrderData {
    status?: OrderStatus
    paymentStatus?: PaymentStatus
    shippingStatus?: ShippingStatus
    trackingNumber?: string
    estimatedDelivery?: Date
    notes?: string
}

export interface OrderFilters {
    userId?: string
    status?: OrderStatus[]
    paymentStatus?: PaymentStatus[]
    shippingStatus?: ShippingStatus[]
    dateFrom?: Date
    dateTo?: Date
}

export interface OrderPagination {
    page: number
    limit: number
    sortBy?: 'createdAt' | 'total' | 'status'
    sortOrder?: 'asc' | 'desc'
}
