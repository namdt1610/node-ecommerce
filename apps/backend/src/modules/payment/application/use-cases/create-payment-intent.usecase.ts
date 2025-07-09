import { IPaymentGateway } from '../../domain/interfaces/payment-gateway.interface'
import {
    CreatePaymentIntentDto,
    PaymentIntentResponseDto,
} from '../dto/payment.dto'

export class CreatePaymentIntentUseCase {
    constructor(private paymentGateway: IPaymentGateway) {}

    async execute(
        userId: string,
        dto: CreatePaymentIntentDto
    ): Promise<PaymentIntentResponseDto> {
        try {
            const paymentIntent = await this.paymentGateway.createPaymentIntent(
                {
                    ...dto,
                    userId,
                }
            )

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
                `Failed to create payment intent: ${(error as Error).message}`
            )
        }
    }
}
