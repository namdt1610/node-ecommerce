"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleWebhookUseCase = void 0;
class HandleWebhookUseCase {
    paymentGateway;
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    async execute(payload, signature) {
        try {
            const event = await this.paymentGateway.validateWebhook(payload, signature);
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSucceeded(event.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailed(event.data.object);
                    break;
                case 'payment_intent.canceled':
                    await this.handlePaymentCanceled(event.data.object);
                    break;
                case 'charge.dispute.created':
                    await this.handleChargeDispute(event.data.object);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
        }
        catch (error) {
            throw new Error(`Failed to handle webhook: ${error.message}`);
        }
    }
    async handlePaymentSucceeded(paymentIntent) {
        // TODO: Update order status to paid
        // TODO: Send confirmation email
        // TODO: Update inventory
        console.log(`Payment succeeded for PaymentIntent: ${paymentIntent.id}`);
        console.log(`Order ID: ${paymentIntent.metadata.orderId}`);
        console.log(`User ID: ${paymentIntent.metadata.userId}`);
    }
    async handlePaymentFailed(paymentIntent) {
        // TODO: Update order status to failed
        // TODO: Send failure notification
        console.log(`Payment failed for PaymentIntent: ${paymentIntent.id}`);
        console.log(`Order ID: ${paymentIntent.metadata.orderId}`);
    }
    async handlePaymentCanceled(paymentIntent) {
        // TODO: Update order status to canceled
        // TODO: Release inventory
        console.log(`Payment canceled for PaymentIntent: ${paymentIntent.id}`);
        console.log(`Order ID: ${paymentIntent.metadata.orderId}`);
    }
    async handleChargeDispute(dispute) {
        // TODO: Handle dispute/chargeback
        // TODO: Notify admin
        console.log(`Charge dispute created: ${dispute.id}`);
        console.log(`Charge ID: ${dispute.charge}`);
    }
}
exports.HandleWebhookUseCase = HandleWebhookUseCase;
