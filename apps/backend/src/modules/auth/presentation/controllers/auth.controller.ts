import { Request, Response } from 'express'
import { RegisterUseCase } from '../../application/use-cases/register.usecase'
import { LoginUseCase } from '../../application/use-cases/login.usecase'
import { LoginSchema } from '../../application/dto/login.dto'
import { BaseController } from '@/common'

export class AuthController extends BaseController {
    constructor(
        private registerUseCase: RegisterUseCase,
        private loginUseCase: LoginUseCase
    ) {
        super()
    }

    async register(req: Request, res: Response) {
        return this.handleAsync(
            res,
            async () => {
                const result = await this.registerUseCase.execute(req.body)

                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })

                return {
                    user: result.user,
                    accessToken: result.accessToken,
                }
            },
            'User registered successfully',
            201
        )
    }

    async login(req: Request, res: Response) {
        return this.handleAsync(
            res,
            async () => {
                const parsed = LoginSchema.safeParse(req.body)
                if (!parsed.success) {
                    return this.sendValidationError(
                        res,
                        parsed.error.errors.map((err) => ({
                            field: err.path.join('.'),
                            message: err.message,
                        }))
                    )
                }

                const result = await this.loginUseCase.execute(parsed.data)

                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })

                return {
                    user: result.user,
                    accessToken: result.accessToken,
                }
            },
            'Login successful'
        )
    }

    async logout(req: Request, res: Response) {
        return this.handleAsync(
            res,
            async () => {
                // Clear the refresh token cookie
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                })

                return { message: 'Logout successful' }
            },
            'Logout successful'
        )
    }
}
