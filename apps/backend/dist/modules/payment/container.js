"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentController = createPaymentController;
exports.createPaymentContainer = createPaymentContainer;
const payment_controller_1 = require("./presentation/controllers/payment.controller");
const create_payment_intent_usecase_1 = require("./application/use-cases/create-payment-intent.usecase");
const confirm_payment_usecase_1 = require("./application/use-cases/confirm-payment.usecase");
const refund_payment_usecase_1 = require("./application/use-cases/refund-payment.usecase");
const handle_webhook_usecase_1 = require("./application/use-cases/handle-webhook.usecase");
const stripe_payment_gateway_1 = require("./infrastructure/services/stripe-payment-gateway");
// Create DI Container
function createPaymentContainer() {
    const paymentGateway = new stripe_payment_gateway_1.StripePaymentGateway();
    return {
        paymentGateway,
        createPaymentIntentUseCase: new create_payment_intent_usecase_1.CreatePaymentIntentUseCase(paymentGateway),
        confirmPaymentUseCase: new confirm_payment_usecase_1.ConfirmPaymentUseCase(paymentGateway),
        refundPaymentUseCase: new refund_payment_usecase_1.RefundPaymentUseCase(paymentGateway),
        handleWebhookUseCase: new handle_webhook_usecase_1.HandleWebhookUseCase(paymentGateway),
    };
}
// Create Payment Controller with DI
function createPaymentController() {
    const container = createPaymentContainer();
    return new payment_controller_1.PaymentController(container.createPaymentIntentUseCase, container.confirmPaymentUseCase, container.refundPaymentUseCase, container.handleWebhookUseCase);
}
