import { IPaymentGateway } from './payment-gateway.interface'
import { CreatePaymentIntentUseCase } from '../../application/use-cases/create-payment-intent.usecase'
import { ConfirmPaymentUseCase } from '../../application/use-cases/confirm-payment.usecase'
import { RefundPaymentUseCase } from '../../application/use-cases/refund-payment.usecase'
import { HandleWebhookUseCase } from '../../application/use-cases/handle-webhook.usecase'

// DI Container Interface
export interface IPaymentContainer {
    paymentGateway: IPaymentGateway
    createPaymentIntentUseCase: CreatePaymentIntentUseCase
    confirmPaymentUseCase: ConfirmPaymentUseCase
    refundPaymentUseCase: RefundPaymentUseCase
    handleWebhookUseCase: HandleWebhookUseCase
}

// Factory type for creating container
export type PaymentContainerFactory = () => IPaymentContainer
