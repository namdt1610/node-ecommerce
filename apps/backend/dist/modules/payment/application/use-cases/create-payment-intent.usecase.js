"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentIntentUseCase = void 0;
class CreatePaymentIntentUseCase {
    paymentGateway;
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    async execute(userId, dto) {
        try {
            const paymentIntent = await this.paymentGateway.createPaymentIntent({
                ...dto,
                userId,
            });
            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.clientSecret,
                metadata: paymentIntent.metadata,
            };
        }
        catch (error) {
            throw new Error(`Failed to create payment intent: ${error.message}`);
        }
    }
}
exports.CreatePaymentIntentUseCase = CreatePaymentIntentUseCase;
