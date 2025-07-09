import { IPaymentGateway } from '../../domain/interfaces/payment-gateway.interface'
import { ConfirmPaymentDto, PaymentIntentResponseDto } from '../dto/payment.dto'

export class ConfirmPaymentUseCase {
    constructor(private paymentGateway: IPaymentGateway) {}

    async execute(dto: ConfirmPaymentDto): Promise<PaymentIntentResponseDto> {
        try {
            const paymentIntent = await this.paymentGateway.confirmPayment(dto)

            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.clientSecret,
                metadata: paymentIntent.metadata,
            }
        } catch (error) {
            throw new Error(
                `Failed to confirm payment: ${(error as Error).message}`
            )
        }
    }
}
