import { NextFunction, Request, Response } from 'express'
import { AuthService } from '@/services/AuthService'
import { AuthSchema } from '@/schemas/AuthSchema'
import jwt from 'jsonwebtoken'

class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
        this.register = this.register.bind(this)
        this.login = this.login.bind(this)
        this.refreshToken = this.refreshToken.bind(this)
        this.logout = this.logout.bind(this)
        this.requestPasswordReset = this.requestPasswordReset.bind(this)
        this.resetPassword = this.resetPassword.bind(this)
        this.requestOtpReset = this.requestOtpReset.bind(this)
        this.verifyOtpAndResetPassword =
            this.verifyOtpAndResetPassword.bind(this)
        this.changePermission = this.changePermission.bind(this)
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
            res.json({ message: 'Log in successfully', user, accessToken })
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
    ): Promise<void> {
        try {
            await this.authService.requestPasswordReset(req.body.email)
            res.json({ message: 'Email reset password has been sent!' })
            return
        } catch (error) {
            next(error)
        }
    }

    async requestOtpReset(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email } = req.body
            await this.authService.requestOtpReset(email)
            res.json({ message: 'OTP has been sent' })
        } catch (error) {
            next(error)
        }
    }

    async verifyOtpAndResetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, otp, newPassword } = req.body
            await this.authService.verifyOtpAndResetPassword(
                email,
                otp,
                newPassword
            )
            res.json({ message: 'Password reset successfully' })
        } catch (error) {
            next(error)
        }
    }

    async resetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { token, newPassword } = req.body
            await this.authService.resetPassword(token, newPassword)
            res.json({ message: 'Password has bent reset successfully' })
            return
        } catch (error) {
            next(error)
        }
    }

    async changePermission(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { userId, roleId, permissions } = req.body
            await this.authService.changePermission(userId, roleId, permissions)
            res.json({ message: 'Permissions updated successfully' })
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController()
