import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { PrismaUserRepo } from '../../modules/user/infrastructure/repositories/user.repository'
import { createError } from './error-handler'

interface AuthenticatedRequest extends Request {
    user?: any
}

export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token =
            req.cookies?.token ||
            req.headers.authorization?.replace('Bearer ', '')

        if (!token) {
            throw createError('Authentication required', 401)
        }

        const secret = process.env.JWT_SECRET || 'your-default-secret'
        const decoded = jwt.verify(token, secret) as { userId: string }

        const userRepository = new PrismaUserRepo()
        const user = await userRepository.findById(decoded.userId)

        if (!user) {
            throw createError('User not found', 401)
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

export const optionalAuthMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token =
            req.cookies?.token ||
            req.headers.authorization?.replace('Bearer ', '')

        if (token) {
            const secret =
                process.env.JWT_ACCESS_SECRET ||
                process.env.JWT_SECRET ||
                'your-default-secret'
            const decoded = jwt.verify(token, secret) as { userId: string }

            const userRepository = new PrismaUserRepo()
            const user = await userRepository.findById(decoded.userId)

            if (user) {
                req.user = user
            }
        }

        next()
    } catch (error) {
        // For optional auth, we don't throw errors
        next()
    }
}
