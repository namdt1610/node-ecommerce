import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '@/models/UserModel'
import redis from '@/config/redis'

const ACCESS_TOKEN_EXPIRES = '15m'
const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 7

class AuthService {
    static generateAccessToken(userId: string) {
        return jwt.sign({ userId }, process.env.ACCESS_SECRET as string, {
            expiresIn: ACCESS_TOKEN_EXPIRES,
        })
    }

    static generateRefreshToken(userId: string) {
        return jwt.sign({ userId }, process.env.REFRESH_SECRET as string, {
            expiresIn: REFRESH_TOKEN_EXPIRES,
        })
    }

    static async storeRefreshToken(userId: string, refreshToken: string) {
        await redis.set(
            `refreshToken:${userId}`,
            refreshToken,
            'EX',
            REFRESH_TOKEN_EXPIRES
        )
    }

    static async getStoredRefreshToken(userId: string, refreshToken: string) {
        const storedToken = await redis.get(`refreshToken:${userId}`)
        return storedToken === refreshToken ? refreshToken : null
    }

    static async revokeRefreshToken(userId: string) {
        await redis.del(`refreshToken:${userId}`)
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ email }).select('+password').lean()
        if (!user) throw new AuthError('Invalid email or password', 401)

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new AuthError('Invalid email or password', 401)

        const accessToken = this.generateAccessToken(user._id.toString())
        const refreshToken = this.generateRefreshToken(user._id.toString())
        await this.storeRefreshToken(user._id.toString(), refreshToken)

        return {
            user: { id: user._id, email: user.email },
            accessToken,
            refreshToken,
        }
    }

    static async register(email: string, password: string) {
        const existingUser = await User.findOne({ email }).lean()
        if (existingUser) throw new AuthError('Email already in use', 409)

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ email, password: hashedPassword })

        return { id: newUser._id, email: newUser.email }
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

export default AuthService
