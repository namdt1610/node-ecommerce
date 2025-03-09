import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '@/models/UserModel'
import redis from '@/config/redis'
import { UserRepository } from '@/repositories/UserRepository'
import crypto from 'crypto'
import { sendResetEmail } from '@/utils/sendEmail'
import { UnitOfWork } from '@/repositories/unitOfWork'
import { uowWrapper } from '@/utils/uowWrapper'

const ACCESS_TOKEN_EXPIRES = '15m'
const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 7

export class AuthService {
    // constructor(private readonly uow: UnitOfWork) {
    //     this.uow = uow
    // }

    generateAccessToken(userId: string) {
        return jwt.sign({ userId }, process.env.ACCESS_SECRET as string, {
            expiresIn: ACCESS_TOKEN_EXPIRES,
        })
    }

    generateRefreshToken(userId: string) {
        return jwt.sign({ userId }, process.env.REFRESH_SECRET as string, {
            expiresIn: REFRESH_TOKEN_EXPIRES,
        })
    }

    async storeRefreshToken(userId: string, refreshToken: string) {
        await redis.set(
            `refreshToken:${userId}`,
            refreshToken,
            'EX',
            REFRESH_TOKEN_EXPIRES
        )
    }

    async getStoredRefreshToken(userId: string, refreshToken: string) {
        const storedToken = await redis.get(`refreshToken:${userId}`)
        return storedToken === refreshToken ? refreshToken : null
    }

    async revokeRefreshToken(userId: string) {
        await redis.del(`refreshToken:${userId}`)
    }

    async login(email: string, password: string) {
        return uowWrapper(async (uow) => {
            const user = await uow.userRepository.findByEmail(email)

            if (!user) throw new AuthError('Invalid email or password', 401)

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) throw new AuthError('Invalid email or password', 401)

            const userId = user._id.toString()
            const accessToken = this.generateAccessToken(userId)
            const refreshToken = this.generateRefreshToken(userId)
            await this.storeRefreshToken(userId, refreshToken)

            return {
                user: { id: user._id, email: user.email },
                accessToken,
                refreshToken,
            }
        })
    }

    async register(email: string, password: string) {
        return uowWrapper(async (uow) => {
            const existingUser = await uow.userRepository.findByEmail(email)
            if (existingUser) throw new AuthError('Email already in use', 409)

            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await uow.userRepository.createUser(
                email,
                hashedPassword
            )

            const userId = newUser._id.toString()
            const accessToken = this.generateAccessToken(userId)
            const refreshToken = this.generateRefreshToken(userId)
            await this.storeRefreshToken(userId, refreshToken)

            return {
                user: { id: newUser._id, email: newUser.email },
                accessToken,
                refreshToken,
            }
        })
    }

    async requestPasswordReset(email: string) {
        return uowWrapper(async (uow) => {
            const user = await uow.userRepository.findByEmail(email)
            if (!user) throw new Error('User not found')

            const resetToken = crypto.randomBytes(32).toString('hex')
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

            await uow.tokenRepository.updateResetToken(
                user._id.toString(),
                resetToken,
                expiresAt
            )

            return resetToken
        })
    }

    async resetPassword(token: string, newPassword: string) {
        return uowWrapper(async (uow) => {
            const tokenData = await uow.tokenRepository.findByResetToken(token)
            if (!tokenData) throw new Error('Invalid or expired token')

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await uow.userRepository.updatePassword(
                tokenData.userId.toString(),
                hashedPassword
            )
            await uow.tokenRepository.deleteResetToken(token)
        })
    }
}

class AuthError extends Error {
    statusCode: number

    constructor(message: string, statusCode = 401) {
        super(message)
        this.name = 'AuthError'
        this.statusCode = statusCode

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthError)
        }
    }
}
