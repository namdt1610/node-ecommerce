import { Request, Response } from 'express'
import { CreatePaymentIntentUseCase } from '../../application/use-cases/create-payment-intent.usecase'
import { ConfirmPaymentUseCase } from '../../application/use-cases/confirm-payment.usecase'
import { RefundPaymentUseCase } from '../../application/use-cases/refund-payment.usecase'
import { HandleWebhookUseCase } from '../../application/use-cases/handle-webhook.usecase'
import {
    CreatePaymentIntentSchema,
    ConfirmPaymentSchema,
    RefundPaymentSchema,
} from '../../application/dto/payment.dto'

interface AuthenticatedRequest extends Request {
    user?: {
        id: string
        email: string
    }
}

interface RawBodyRequest extends Request {
    rawBody?: Buffer
}

export class PaymentController {
    constructor(
        private createPaymentIntentUseCase: CreatePaymentIntentUseCase,
        private confirmPaymentUseCase: ConfirmPaymentUseCase,
        private refundPaymentUseCase: RefundPaymentUseCase,
        private handleWebhookUseCase: HandleWebhookUseCase
    ) {}

    async createPaymentIntent(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                })
            }

            const parsed = CreatePaymentIntentSchema.safeParse(req.body)
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: parsed.error.errors,
                })
            }

            const paymentIntent = await this.createPaymentIntentUseCase.execute(
                userId,
                parsed.data
            )

            res.status(201).json({
                success: true,
                data: paymentIntent,
                message: 'Payment intent created successfully',
            })
        } catch (err: any) {
            res.status(400).json({
                success: false,
                error: err.message,
            })
        }
    }

    async confirmPayment(req: Request, res: Response) {
        try {
            const parsed = ConfirmPaymentSchema.safeParse(req.body)
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: parsed.error.errors,
                })
            }

            const paymentIntent = await this.confirmPaymentUseCase.execute(
                parsed.data
            )

            res.json({
                success: true,
                data: paymentIntent,
                message: 'Payment confirmed successfully',
            })
        } catch (err: any) {
            res.status(400).json({
                success: false,
                error: err.message,
            })
        }
    }

    async refundPayment(req: Request, res: Response) {
        try {
            const parsed = RefundPaymentSchema.safeParse(req.body)
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: parsed.error.errors,
                })
            }

            const refund = await this.refundPaymentUseCase.execute(parsed.data)

            res.json({
                success: true,
                data: refund,
                message: 'Payment refunded successfully',
            })
        } catch (err: any) {
            res.status(400).json({
                success: false,
                error: err.message,
            })
        }
    }

    async handleWebhook(req: RawBodyRequest, res: Response) {
        try {
            const signature = req.headers['stripe-signature'] as string
            const payload = req.rawBody?.toString() || req.body

            if (!signature) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing stripe-signature header',
                })
            }

            await this.handleWebhookUseCase.execute(payload, signature)

            res.json({
                success: true,
                message: 'Webhook handled successfully',
            })
        } catch (err: any) {
            console.error('Webhook error:', err.message)
            res.status(400).json({
                success: false,
                error: 'Webhook handling failed',
            })
        }
    }

    async getPaymentStatus(req: Request, res: Response) {
        try {
            const { paymentIntentId } = req.params

            if (!paymentIntentId) {
                return res.status(400).json({
                    success: false,
                    error: 'Payment intent ID is required',
                })
            }

            // This would typically call a use case to get payment status
            // For now, return a simple response
            res.json({
                success: true,
                message: 'Payment status endpoint',
                paymentIntentId,
            })
        } catch (err: any) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    }
}
