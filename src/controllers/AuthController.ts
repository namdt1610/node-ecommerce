import { NextFunction, Request, Response } from 'express'
import AuthService from '@/services/AuthService'
import { UnitOfWork } from '@/repositories/unitOfWork'
import { AuthSchema } from '@/schemas/AuthSchema'
import jwt from 'jsonwebtoken'

class AuthController {
    static async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const uow = new UnitOfWork()
        try {
            AuthSchema.parse(req.body)
            await uow.start()
            const { email, password } = req.body
            const newUser = await AuthService.register(email, password)
            await uow.commit()
            res.status(201).json(newUser)
        } catch (error: any) {
            await uow.rollback()
            if (process.env.NODE_ENV == 'production') {
                return next(new Error('An unexpected error occured!'))
            }
            next(error)
        }
    }

    static async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const uow = new UnitOfWork()
        try {
            AuthSchema.parse(req.body)
            await uow.start()
            const { email, password } = req.body
            const { user, accessToken, refreshToken } = await AuthService.login(
                email,
                password
            )
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            await uow.commit()
            res.json({ message: 'Log in successfully!', user, accessToken })
        } catch (error: any) {
            await uow.rollback()
            if (process.env.NODE_ENV == 'production') {
                return next(new Error('An unexpected error occured!'))
            }
            next(error)
        }
    }

    static async refreshToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken

            if (!refreshToken)
                res.status(403).json({ message: 'No refresh token' })

            const decoded: any = jwt.verify(
                refreshToken,
                process.env.REFRESH_SECRET as string
            )

            const storedToken = await AuthService.getStoredRefreshToken(
                decoded.userId,
                refreshToken
            )
            if (storedToken !== refreshToken) {
                res.status(403).json({ message: 'Invalid refresh token' })
                return
            }

            const newAccessToken = AuthService.generateAccessToken(
                decoded.userId
            )
            res.json({ accessToken: newAccessToken })
        } catch (error) {
            next(error)
        }
    }

    static async logout(
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
                await AuthService.revokeRefreshToken(decoded.userId)
            }

            res.clearCookie('refreshToken')
            res.json({ message: 'Logged out successfully' })
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController
