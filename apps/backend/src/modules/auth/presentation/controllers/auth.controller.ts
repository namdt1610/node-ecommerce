import { Request, Response } from 'express'
import { RegisterUseCase } from '../../application/use-cases/register.usecase'
import { LoginUseCase } from '../../application/use-cases/login.usecase'
import { LoginSchema } from '../../application/dto/login.dto'

export class AuthController {
    constructor(
        private registerUseCase: RegisterUseCase,
        private loginUseCase: LoginUseCase
    ) {}

    async register(req: Request, res: Response) {
        try {
            const result = await this.registerUseCase.execute(req.body)

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            res.status(201).json({
                user: result.user,
                accessToken: result.accessToken,
            })
        } catch (err: any) {
            res.status(400).json({ error: err.message })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const parsed = LoginSchema.safeParse(req.body)
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.errors })
            }
            const result = await this.loginUseCase.execute(parsed.data)
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            res.status(200).json({
                user: result.user,
                accessToken: result.accessToken,
            })
        } catch (err: any) {
            res.status(401).json({ error: err.message })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            // Clear the refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })

            res.status(200).json({
                message: 'Logout successful',
            })
        } catch (err: any) {
            res.status(500).json({ error: err.message })
        }
    }
}
