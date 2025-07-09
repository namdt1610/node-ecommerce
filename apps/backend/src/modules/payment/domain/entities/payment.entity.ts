export interface Payment {
    id: string
    orderId: string
    userId: string
    amount: number
    currency: string
    status: PaymentStatus
    method: PaymentMethod
    gatewayTransactionId?: string
    gatewayResponse?: GatewayResponse
    failureReason?: string
    processedAt?: Date
    createdAt: Date
    updatedAt: Date
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
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

export interface GatewayResponse {
    transactionId: string
    responseCode: string
    responseMessage: string
    authorizationCode?: string
    cardLast4?: string
    cardBrand?: string
}

export interface CreatePaymentData {
    orderId: string
    userId: string
    amount: number
    currency: string
    method: PaymentMethod
    paymentDetails: PaymentDetails
}

export interface PaymentDetails {
    cardToken?: string
    cardNumber?: string
    expiryMonth?: number
    expiryYear?: number
    cvv?: string
    cardHolderName?: string
    billingAddress?: BillingAddress
}

export interface BillingAddress {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
}

export interface RefundData {
    paymentId: string
    amount: number
    reason: string
}

export interface PaymentFilters {
    userId?: string
    orderId?: string
    status?: PaymentStatus[]
    method?: PaymentMethod[]
    dateFrom?: Date
    dateTo?: Date
    amountMin?: number
    amountMax?: number
}

export interface PaymentPagination {
    page: number
    limit: number
    sortBy?: 'createdAt' | 'amount' | 'status'
    sortOrder?: 'asc' | 'desc'
}
