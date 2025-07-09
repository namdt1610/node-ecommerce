import Stripe from 'stripe'
import {
    IPaymentGateway,
    PaymentIntent,
    CreatePaymentIntentData,
    ConfirmPaymentData,
    RefundPaymentData,
} from '../../domain/interfaces/payment-gateway.interface'

export class StripePaymentGateway implements IPaymentGateway {
    private stripe: Stripe

    constructor() {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error(
                'STRIPE_SECRET_KEY environment variable is required'
            )
        }

        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-06-30.basil',
        })
    }

    async createPaymentIntent(
        data: CreatePaymentIntentData
    ): Promise<PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(data.amount * 100), // Convert to cents
                currency: data.currency,
                metadata: {
                    orderId: data.orderId,
                    userId: data.userId,
                    ...data.metadata,
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            })

            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount / 100, // Convert back to dollars
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret!,
                metadata: paymentIntent.metadata,
            }
        } catch (error) {
            throw new Error(
                `Failed to create payment intent: ${(error as Error).message}`
            )
        }
    }

    async confirmPayment(data: ConfirmPaymentData): Promise<PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(
                data.paymentIntentId,
                {
                    payment_method: data.paymentMethodId,
                }
            )

            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret!,
                metadata: paymentIntent.metadata,
            }
        } catch (error) {
            throw new Error(
                `Failed to confirm payment: ${(error as Error).message}`
            )
        }
    }

    async refundPayment(
        data: RefundPaymentData
    ): Promise<{ id: string; amount: number; status: string }> {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: data.paymentIntentId,
                amount: data.amount ? Math.round(data.amount * 100) : undefined, // Convert to cents if specified
                reason: data.reason as Stripe.RefundCreateParams.Reason,
            })

            return {
                id: refund.id,
                amount: refund.amount / 100, // Convert back to dollars
                status: refund.status || 'unknown',
            }
        } catch (error) {
            throw new Error(
                `Failed to refund payment: ${(error as Error).message}`
            )
        }
    }

    async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
        try {
            const paymentIntent =
                await this.stripe.paymentIntents.retrieve(paymentIntentId)

            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret!,
                metadata: paymentIntent.metadata,
            }
        } catch (error) {
            throw new Error(
                `Failed to get payment intent: ${(error as Error).message}`
            )
        }
    }

    // Webhook validation method
    async validateWebhook(
        payload: string,
        signature: string
    ): Promise<Stripe.Event> {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
        if (!webhookSecret) {
            throw new Error(
                'STRIPE_WEBHOOK_SECRET environment variable is required'
            )
        }

        try {
            return this.stripe.webhooks.constructEvent(
                payload,
                signature,
                webhookSecret
            )
        } catch (error) {
            throw new Error(
                `Webhook signature verification failed: ${(error as Error).message}`
            )
        }
    }
}
