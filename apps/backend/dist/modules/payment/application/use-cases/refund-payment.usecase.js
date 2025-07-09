"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPaymentUseCase = void 0;
class RefundPaymentUseCase {
    paymentGateway;
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    async execute(dto) {
        try {
            return await this.paymentGateway.refundPayment(dto);
        }
        catch (error) {
            throw new Error(`Failed to refund payment: ${error.message}`);
        }
    }
}
exports.RefundPaymentUseCase = RefundPaymentUseCase;
