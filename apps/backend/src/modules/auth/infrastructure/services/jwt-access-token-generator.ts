import { IJwtAccessTokenGenerator } from '../../domain/interfaces/jwt-access-token-generator'
import jwt from 'jsonwebtoken'

export class JwtAccessTokenService implements IJwtAccessTokenGenerator {
    generate(userId: string): string {
        const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
        if (!secret) {
            throw new Error(
                'JWT_ACCESS_SECRET or JWT_SECRET environment variable is required'
            )
        }

        return jwt.sign({ userId }, secret, {
            expiresIn: '15m',
        })
    }
}
