import { IJwtRefreshTokenGenerator } from '../../domain/interfaces/jwt-refresh-token-generator'
import jwt from 'jsonwebtoken'

export class JwtRefreshTokenService implements IJwtRefreshTokenGenerator {
    generate(userId: string): string {
        const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        if (!secret) {
            throw new Error(
                'JWT_REFRESH_SECRET or JWT_SECRET environment variable is required'
            )
        }

        return jwt.sign({ userId }, secret, {
            expiresIn: '7d',
        })
    }
}
