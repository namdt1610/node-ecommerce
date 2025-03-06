import mongoose from 'mongoose'

export class UnitOfWork {
    private session: mongoose.ClientSession | null = null

    async start(): Promise<void> {
        this.session = await mongoose.startSession()
        this.session.startTransaction()
    }

    async commit(): Promise<void> {
        if (this.session) {
            await this.session.commitTransaction()
            this.session.endSession()
        }
    }

    async rollback(): Promise<void> {
        if (this.session) {
            await this.session.abortTransaction()
            this.session.endSession()
        }
    }

    getSession(): mongoose.ClientSession {
        if (!this.session) {
            throw new Error('Transaction not started')
        }
        return this.session
    }
}
