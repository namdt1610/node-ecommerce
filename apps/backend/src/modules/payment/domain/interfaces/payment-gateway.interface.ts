export interface PaymentIntent {
    id: string
    amount: number
    currency: string
    status: string
    clientSecret: string
    metadata?: Record<string, string>
}

export interface CreatePaymentIntentData {
    amount: number
    currency: string
    orderId: string
    userId: string
    metadata?: Record<string, string>
}

export interface ConfirmPaymentData {
    paymentIntentId: string
    paymentMethodId: string
}

export interface RefundPaymentData {
    paymentIntentId: string
    amount?: number
    reason?: string
}

export interface IPaymentGateway {
    createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntent>
    confirmPayment(data: ConfirmPaymentData): Promise<PaymentIntent>
    refundPayment(data: RefundPaymentData): Promise<{ id: string; amount: number; status: string }>
    getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent>
} 