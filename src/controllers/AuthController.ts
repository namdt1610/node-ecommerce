import { NextFunction, Request, Response } from 'express'
import { AuthService } from '@/services/AuthService'
import { AuthSchema } from '@/schemas/AuthSchema'
import jwt from 'jsonwebtoken'

class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            AuthSchema.parse(req.body)
            const { email, password } = req.body
            const newUser = await this.authService.register(email, password)
            res.status(201).json(newUser)
        } catch (error: any) {
            next(error)
        }
    }

    async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            AuthSchema.parse(req.body)
            const { email, password } = req.body
            const { user, accessToken, refreshToken } =
                await this.authService.login(email, password)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            res.json({ message: 'Log in successfully!', user, accessToken })
        } catch (error: any) {
            next(error)
        }
    }

    async refreshToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken

            if (!refreshToken) {
                res.status(403).json({ message: 'No refresh token' })
                return
            }

            const decoded: any = jwt.verify(
                refreshToken,
                process.env.REFRESH_SECRET as string
            )

            const storedToken = await this.authService.getStoredRefreshToken(
                decoded.userId,
                refreshToken
            )
            if (storedToken !== refreshToken) {
                res.status(403).json({ message: 'Invalid refresh token' })
                return
            }

            const newAccessToken = this.authService.generateAccessToken(
                decoded.userId
            )
            res.json({ accessToken: newAccessToken })
        } catch (error) {
            next(error)
        }
    }

    async logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken
            if (refreshToken) {
                const decoded: any = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_SECRET as string
                )
                await this.authService.revokeRefreshToken(decoded.userId)
            }

            res.clearCookie('refreshToken')
            res.json({ message: 'Logged out successfully' })
        } catch (error) {
            next(error)
        }
    }

    async requestPasswordReset(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            await this.authService.requestPasswordReset(req.body.email)
            return res.json({ message: 'Email reset password đã được gửi!' })
        } catch (error) {
            next(error)
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body
            await this.authService.resetPassword(token, newPassword)
            return res.json({ message: 'Mật khẩu đã được đặt lại thành công!' })
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController()
