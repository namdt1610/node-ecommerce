import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import redis from '@/config/redis'
import crypto from 'crypto'
import { sendResetEmail, sendOtpEmail } from '@/utils/sendEmail'
import { uowWrapper } from '@/utils/uowWrapper'
import Role from '@/models/RoleModel'

const ACCESS_TOKEN_EXPIRES = '15m'
const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 7

export class AuthService {
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
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

            await uow.tokenRepository.updateResetToken(
                user._id.toString(),
                resetToken,
                expiresAt
            )

            const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
            if (process.env.NODE_ENV === 'development') {
                console.log(`Reset token for ${email}: ${resetToken}`)
                console.log(`Reset URL: ${resetUrl}`)
            }
            await sendResetEmail(user.email, resetUrl)

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

    // Add to AuthService class
    async requestOtpReset(email: string) {
        return uowWrapper(async (uow) => {
            const user = await uow.userRepository.findByEmail(email)
            if (!user) throw new Error('User not found')

            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

            await uow.tokenRepository.updateOtp(
                user._id.toString(),
                otp,
                expiresAt
            )

            // For testing, print the OTP to console
            if (process.env.NODE_ENV === 'development') {
                console.log(`OTP for ${email}: ${otp}`)
            }

            // In production, you'd send this via SMS or email
            // await sendOtp(user.email, otp);

            try {
                await sendOtpEmail(user.email, otp)
            } catch (error) {
                console.error('Failed to send OTP email:', error)
                // Continue anyway since we logged the OTP in dev mode
            }

            return { userId: user._id, message: 'OTP generated successfully' }
        })
    }

    async verifyOtpAndResetPassword(
        email: string,
        otp: string,
        newPassword: string
    ) {
        return uowWrapper(async (uow) => {
            const user = await uow.userRepository.findByEmail(email)
            if (!user) throw new Error('User not found')

            const isValid = await uow.tokenRepository.verifyOtp(
                user._id.toString(),
                otp
            )
            if (!isValid) throw new Error('Invalid or expired OTP')

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await uow.userRepository.updatePassword(
                user._id.toString(),
                hashedPassword
            )

            await uow.tokenRepository.clearOtp(user._id.toString())

            return { message: 'Password reset successful' }
        })
    }

    async changePermission(
        userId: string,
        roleId: string,
        permissions: string[]
    ) {
        return uowWrapper(async (uow) => {
            // Verify user exists
            const user = await uow.userRepository.findById(userId)
            if (!user) throw new Error('User not found')

            // Change user's role if roleId is provided
            if (roleId) {
                const role = await Role.findById(roleId)
                if (!role) throw new Error('Role not found')

                // Update user's role
                user.role = role._id
                await user.save()
            }

            // If permissions are provided, update the permissions of the role
            if (permissions && permissions.length > 0) {
                // Get the user's current role
                const userRole = await Role.findById(user.role)
                if (!userRole) throw new Error('Role not found')

                // Update role permissions
                userRole.permissions = permissions
                await userRole.save()
            }

            return {
                message: 'User permissions updated successfully',
                user: { id: user._id, email: user.email },
            }
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
