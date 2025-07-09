"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_dto_1 = require("../../application/dto/payment.dto");
class PaymentController {
    createPaymentIntentUseCase;
    confirmPaymentUseCase;
    refundPaymentUseCase;
    handleWebhookUseCase;
    constructor(createPaymentIntentUseCase, confirmPaymentUseCase, refundPaymentUseCase, handleWebhookUseCase) {
        this.createPaymentIntentUseCase = createPaymentIntentUseCase;
        this.confirmPaymentUseCase = confirmPaymentUseCase;
        this.refundPaymentUseCase = refundPaymentUseCase;
        this.handleWebhookUseCase = handleWebhookUseCase;
    }
    async createPaymentIntent(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
            }
            const parsed = payment_dto_1.CreatePaymentIntentSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: parsed.error.errors,
                });
            }
            const paymentIntent = await this.createPaymentIntentUseCase.execute(userId, parsed.data);
            res.status(201).json({
                success: true,
                data: paymentIntent,
                message: 'Payment intent created successfully',
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                error: err.message,
            });
        }
    }
    async confirmPayment(req, res) {
        try {
            const parsed = payment_dto_1.ConfirmPaymentSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: parsed.error.errors,
                });
            }
            const paymentIntent = await this.confirmPaymentUseCase.execute(parsed.data);
            res.json({
                success: true,
                data: paymentIntent,
                message: 'Payment confirmed successfully',
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                error: err.message,
            });
        }
    }
    async refundPayment(req, res) {
        try {
            const parsed = payment_dto_1.RefundPaymentSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: parsed.error.errors,
                });
            }
            const refund = await this.refundPaymentUseCase.execute(parsed.data);
            res.json({
                success: true,
                data: refund,
                message: 'Payment refunded successfully',
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                error: err.message,
            });
        }
    }
    async handleWebhook(req, res) {
        try {
            const signature = req.headers['stripe-signature'];
            const payload = req.rawBody?.toString() || req.body;
            if (!signature) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing stripe-signature header',
                });
            }
            await this.handleWebhookUseCase.execute(payload, signature);
            res.json({
                success: true,
                message: 'Webhook handled successfully',
            });
        }
        catch (err) {
            console.error('Webhook error:', err.message);
            res.status(400).json({
                success: false,
                error: 'Webhook handling failed',
            });
        }
    }
    async getPaymentStatus(req, res) {
        try {
            const { paymentIntentId } = req.params;
            if (!paymentIntentId) {
                return res.status(400).json({
                    success: false,
                    error: 'Payment intent ID is required',
                });
            }
            // This would typically call a use case to get payment status
            // For now, return a simple response
            res.json({
                success: true,
                message: 'Payment status endpoint',
                paymentIntentId,
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
}
exports.PaymentController = PaymentController;
