/**
 * Common shared types and interfaces used across multiple modules
 * This helps eliminate duplication of common structures
 */

// Address Types
export interface BaseAddress {
    fullName: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault?: boolean
}

export interface ShippingAddress extends BaseAddress {
    deliveryInstructions?: string
}

export interface BillingAddress extends BaseAddress {
    taxId?: string
}

// Pagination Types
export interface PaginationParams {
    page: number
    limit: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PaginationResult<T> {
    data: T[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        hasNext: boolean
        hasPrev: boolean
    }
}

// Filter Types
export interface DateFilter {
    from?: Date
    to?: Date
}

export interface PriceFilter {
    min?: number
    max?: number
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean
    message?: string
    data?: T
    errors?: ValidationErrorDetail[]
    meta?: Record<string, any>
}

export interface ValidationErrorDetail {
    field: string
    message: string
    code?: string
}

// Enum Types
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
    PROCESSING = 'PROCESSING',
    AUTHORIZED = 'AUTHORIZED',
    CAPTURED = 'CAPTURED',
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    PAYPAL = 'PAYPAL',
    APPLE_PAY = 'APPLE_PAY',
    GOOGLE_PAY = 'GOOGLE_PAY',
    BANK_TRANSFER = 'BANK_TRANSFER',
    STRIPE = 'STRIPE',
}

export enum ShippingStatus {
    NOT_SHIPPED = 'NOT_SHIPPED',
    PREPARING = 'PREPARING',
    SHIPPED = 'SHIPPED',
    IN_TRANSIT = 'IN_TRANSIT',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    DELIVERED = 'DELIVERED',
    FAILED_DELIVERY = 'FAILED_DELIVERY',
}
