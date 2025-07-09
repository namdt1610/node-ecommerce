import Stripe from 'stripe'
import { StripePaymentGateway } from '../../infrastructure/services/stripe-payment-gateway'

export class HandleWebhookUseCase {
    constructor(private paymentGateway: StripePaymentGateway) {}

    async execute(payload: string, signature: string): Promise<void> {
        try {
            const event = await this.paymentGateway.validateWebhook(
                payload,
                signature
            )

            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSucceeded(
                        event.data.object as Stripe.PaymentIntent
                    )
                    break

                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailed(
                        event.data.object as Stripe.PaymentIntent
                    )
                    break

                case 'payment_intent.canceled':
                    await this.handlePaymentCanceled(
                        event.data.object as Stripe.PaymentIntent
                    )
                    break

                case 'charge.dispute.created':
                    await this.handleChargeDispute(
                        event.data.object as Stripe.Dispute
                    )
                    break

                default:
                    console.log(`Unhandled event type: ${event.type}`)
            }
        } catch (error) {
            throw new Error(
                `Failed to handle webhook: ${(error as Error).message}`
            )
        }
    }

    private async handlePaymentSucceeded(
        paymentIntent: Stripe.PaymentIntent
    ): Promise<void> {
        // TODO: Update order status to paid
        // TODO: Send confirmation email
        // TODO: Update inventory
        console.log(`Payment succeeded for PaymentIntent: ${paymentIntent.id}`)
        console.log(`Order ID: ${paymentIntent.metadata.orderId}`)
        console.log(`User ID: ${paymentIntent.metadata.userId}`)
    }

    private async handlePaymentFailed(
        paymentIntent: Stripe.PaymentIntent
    ): Promise<void> {
        // TODO: Update order status to failed
        // TODO: Send failure notification
        console.log(`Payment failed for PaymentIntent: ${paymentIntent.id}`)
        console.log(`Order ID: ${paymentIntent.metadata.orderId}`)
    }

    private async handlePaymentCanceled(
        paymentIntent: Stripe.PaymentIntent
    ): Promise<void> {
        // TODO: Update order status to canceled
        // TODO: Release inventory
        console.log(`Payment canceled for PaymentIntent: ${paymentIntent.id}`)
        console.log(`Order ID: ${paymentIntent.metadata.orderId}`)
    }

    private async handleChargeDispute(dispute: Stripe.Dispute): Promise<void> {
        // TODO: Handle dispute/chargeback
        // TODO: Notify admin
        console.log(`Charge dispute created: ${dispute.id}`)
        console.log(`Charge ID: ${dispute.charge}`)
    }
}
