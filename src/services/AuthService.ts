import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '@/models/UserModel'
import redis from '@/config/redis'
import { UserRepository } from '@/repositories/UserRepository'
import crypto from 'crypto'
import { sendResetEmail } from '@/utils/sendEmail'
import { UnitOfWork } from '@/repositories/unitOfWork'

const ACCESS_TOKEN_EXPIRES = '15m'
const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 7

class AuthService {
    async generateAccessToken(userId: string) {
        return jwt.sign({ userId }, process.env.ACCESS_SECRET as string, {
            expiresIn: ACCESS_TOKEN_EXPIRES,
        })
    }

    async generateRefreshToken(userId: string) {
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
        const user = await User.findOne({ email }).select('+password').lean()
        if (!user) throw new AuthError('Invalid email or password', 401)

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new AuthError('Invalid email or password', 401)

        const accessToken = this.generateAccessToken(user._id.toString())
        const refreshToken = this.generateRefreshToken(user._id.toString())
        await this.storeRefreshToken(user._id.toString(), await refreshToken)

        return {
            user: { id: user._id, email: user.email },
            accessToken,
            refreshToken,
        }
    }

    async register(email: string, password: string) {
        const existingUser = await User.findOne({ email }).lean()
        if (existingUser) throw new AuthError('Email already in use', 409)

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ email, password: hashedPassword })

        return { id: newUser._id, email: newUser.email }
    }

    async requestPasswordReset(email: string) {
        const uow = new UnitOfWork()
        await uow.start()

        try {
            const user = await uow.userRepository.findByEmail(email)
            if (!user) throw new Error('User not found')

            const resetToken = crypto.randomBytes(32).toString('hex')
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 phút

            await uow.tokenRepository.updateResetToken(
                user._id.toString(),
                resetToken,
                expiresAt
            )

            await uow.commit()
            return resetToken // Gửi email reset password với token này
        } catch (error) {
            await uow.rollback()
            throw error
        }
    }

    async resetPassword(token: string, newPassword: string) {
        const uow = new UnitOfWork()
        await uow.start()

        try {
            const tokenData = await uow.tokenRepository.findByResetToken(token)
            if (!tokenData) throw new Error('Invalid or expired token')

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await uow.userRepository.updatePassword(
                tokenData.userId.toString(),
                hashedPassword
            )
            await uow.tokenRepository.deleteResetToken(token)

            await uow.commit()
        } catch (error) {
            await uow.rollback()
            throw error
        }
    }
}

class AuthError extends Error {
    statusCode: number

    constructor(message: string, statusCode = 401) {
        super(message)
        this.name = 'AuthError'
        this.statusCode = statusCode
    }
}

export default new AuthService()
