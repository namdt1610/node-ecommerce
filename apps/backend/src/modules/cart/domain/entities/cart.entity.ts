import { Product } from '../../../product/domain/entities/product.entity'

export interface Cart {
    id: string
    userId: string
    items: CartItem[]
    totalItems: number
    totalAmount: number
    currency: string
    discountAmount?: number
    taxAmount?: number
    shippingAmount?: number
    finalAmount: number
    createdAt: Date
    updatedAt: Date
}

export interface CartItem {
    id: string
    cartId: string
    productId: string
    product?: Product
    variantId?: string
    quantity: number
    unitPrice: number
    totalPrice: number
    discountAmount?: number
    addedAt: Date
    updatedAt: Date
}

export interface AddToCartData {
    userId: string
    productId: string
    variantId?: string
    quantity: number
}

export interface UpdateCartItemData {
    quantity: number
}

export interface CartSummary {
    totalItems: number
    totalAmount: number
    discountAmount: number
    taxAmount: number
    shippingAmount: number
    finalAmount: number
    currency: string
}

export interface CartValidation {
    isValid: boolean
    errors: CartValidationError[]
    warnings: CartValidationWarning[]
}

export interface CartValidationError {
    type:
        | 'OUT_OF_STOCK'
        | 'PRODUCT_NOT_FOUND'
        | 'INVALID_QUANTITY'
        | 'PRICE_CHANGED'
    productId: string
    variantId?: string
    message: string
    currentQuantity?: number
    availableQuantity?: number
    currentPrice?: number
    previousPrice?: number
}

export interface CartValidationWarning {
    type: 'LOW_STOCK' | 'PRICE_INCREASE' | 'LIMITED_TIME_OFFER'
    productId: string
    variantId?: string
    message: string
    value?: number
}

// Enhanced cart operations
export interface CartOperations {
    calculateTotals(): CartSummary
    validateItems(): CartValidation
    applyDiscounts(discounts: CartDiscount[]): void
    calculateShipping(address?: ShippingAddress): number
    calculateTax(address?: BillingAddress): number
}

export interface CartDiscount {
    id: string
    type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y'
    code?: string
    value: number
    minimumAmount?: number
    applicableProducts?: string[]
    applicableCategories?: string[]
    maxUsage?: number
    currentUsage?: number
    expiresAt?: Date
}

export interface ShippingAddress {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
}

export interface BillingAddress {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
}
