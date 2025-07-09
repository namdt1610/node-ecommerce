import { IPaymentGateway } from '../../domain/interfaces/payment-gateway.interface'
import { RefundPaymentDto } from '../dto/payment.dto'

export class RefundPaymentUseCase {
    constructor(private paymentGateway: IPaymentGateway) {}

    async execute(
        dto: RefundPaymentDto
    ): Promise<{ id: string; amount: number; status: string }> {
        try {
            return await this.paymentGateway.refundPayment(dto)
        } catch (error) {
            throw new Error(
                `Failed to refund payment: ${(error as Error).message}`
            )
        }
    }
}
