import mongoose from 'mongoose'
import { UserRepository } from '@/repositories/UserRepository'
import { TokenRepository } from '@/repositories/TokenRepository'

export class UnitOfWork {
    private session: mongoose.ClientSession | null = null
    userRepository: UserRepository
    tokenRepository: TokenRepository

    constructor() {
        this.userRepository = new UserRepository()
        this.tokenRepository = new TokenRepository()
    }

    async start(): Promise<void> {
        this.session = await mongoose.startSession()
        this.session.startTransaction()
        this.userRepository.setSession(this.session)
        this.tokenRepository.setSession(this.session)
    }

    async commit(): Promise<void> {
        if (this.session) {
            await this.session.commitTransaction()
            this.session.endSession()
            this.session = null
        }
    }

    async rollback(): Promise<void> {
        if (this.session) {
            await this.session.abortTransaction()
            this.session.endSession()
            this.session = null
        }
    }
}
