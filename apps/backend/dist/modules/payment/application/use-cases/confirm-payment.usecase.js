"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmPaymentUseCase = void 0;
class ConfirmPaymentUseCase {
    paymentGateway;
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    async execute(dto) {
        try {
            const paymentIntent = await this.paymentGateway.confirmPayment(dto);
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
            throw new Error(`Failed to confirm payment: ${error.message}`);
        }
    }
}
exports.ConfirmPaymentUseCase = ConfirmPaymentUseCase;
