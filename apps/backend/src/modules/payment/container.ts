import { PaymentController } from './presentation/controllers/payment.controller'
import { CreatePaymentIntentUseCase } from './application/use-cases/create-payment-intent.usecase'
import { ConfirmPaymentUseCase } from './application/use-cases/confirm-payment.usecase'
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.usecase'
import { HandleWebhookUseCase } from './application/use-cases/handle-webhook.usecase'
import { StripePaymentGateway } from './infrastructure/services/stripe-payment-gateway'
import { IPaymentContainer } from './domain/interfaces/payment-container'

// Create DI Container
function createPaymentContainer(): IPaymentContainer {
    const paymentGateway = new StripePaymentGateway()

    return {
        paymentGateway,
        createPaymentIntentUseCase: new CreatePaymentIntentUseCase(
            paymentGateway
        ),
        confirmPaymentUseCase: new ConfirmPaymentUseCase(paymentGateway),
        refundPaymentUseCase: new RefundPaymentUseCase(paymentGateway),
        handleWebhookUseCase: new HandleWebhookUseCase(paymentGateway),
    }
}

// Create Payment Controller with DI
export function createPaymentController(): PaymentController {
    const container = createPaymentContainer()

    return new PaymentController(
        container.createPaymentIntentUseCase,
        container.confirmPaymentUseCase,
        container.refundPaymentUseCase,
        container.handleWebhookUseCase
    )
}

// Export container for testing
export { createPaymentContainer }
