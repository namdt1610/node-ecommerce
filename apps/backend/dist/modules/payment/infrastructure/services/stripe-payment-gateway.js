"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentGateway = void 0;
const stripe_1 = __importDefault(require("stripe"));
class StripePaymentGateway {
    stripe;
    constructor() {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY environment variable is required');
        }
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-06-30.basil',
        });
    }
    async createPaymentIntent(data) {
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
            });
            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount / 100, // Convert back to dollars
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret,
                metadata: paymentIntent.metadata,
            };
        }
        catch (error) {
            throw new Error(`Failed to create payment intent: ${error.message}`);
        }
    }
    async confirmPayment(data) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(data.paymentIntentId, {
                payment_method: data.paymentMethodId,
            });
            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret,
                metadata: paymentIntent.metadata,
            };
        }
        catch (error) {
            throw new Error(`Failed to confirm payment: ${error.message}`);
        }
    }
    async refundPayment(data) {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: data.paymentIntentId,
                amount: data.amount ? Math.round(data.amount * 100) : undefined, // Convert to cents if specified
                reason: data.reason,
            });
            return {
                id: refund.id,
                amount: refund.amount / 100, // Convert back to dollars
                status: refund.status || 'unknown',
            };
        }
        catch (error) {
            throw new Error(`Failed to refund payment: ${error.message}`);
        }
    }
    async getPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret,
                metadata: paymentIntent.metadata,
            };
        }
        catch (error) {
            throw new Error(`Failed to get payment intent: ${error.message}`);
        }
    }
    // Webhook validation method
    async validateWebhook(payload, signature) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
        }
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (error) {
            throw new Error(`Webhook signature verification failed: ${error.message}`);
        }
    }
}
exports.StripePaymentGateway = StripePaymentGateway;
