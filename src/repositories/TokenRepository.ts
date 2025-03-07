import mongoose from 'mongoose'
import { Token } from '@/models/TokenModel'

export class TokenRepository {
    private session: mongoose.ClientSession | null = null

    setSession(session: mongoose.ClientSession) {
        this.session = session
    }

    async updateResetToken(userId: string, token: string, expiresAt: Date) {
        return Token.updateOne(
            { userId },
            { token, expiresAt },
            { upsert: true, session: this.session as any }
        )
    }

    async findByResetToken(token: string) {
        return Token.findOne({ token, expiresAt: { $gt: new Date() } }).session(
            this.session as any
        )
    }

    async deleteResetToken(token: string) {
        return Token.deleteOne({ token }).session(this.session as any)
    }
}
