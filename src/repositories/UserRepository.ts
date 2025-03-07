import mongoose from 'mongoose'
import User from '@/models/UserModel'

export class UserRepository {
    private session: mongoose.ClientSession | null = null

    setSession(session: mongoose.ClientSession) {
        this.session = session
    }

    async findByEmail(email: string) {
        return User.findOne({ email }).session(this.session as any)
    }

    async findById(userId: string) {
        return User.findById(userId).session(this.session as any)
    }

    async createUser(email: string, password: string, role: string = 'user') {
        return User.create([{ email, password, role }], {
            session: this.session as any,
        })
    }

    async updatePassword(userId: string, newPassword: string) {
        return User.updateOne(
            { _id: userId },
            { password: newPassword }
        ).session(this.session as any)
    }

    async deleteUser(userId: string) {
        return User.deleteOne({ _id: userId }).session(this.session as any)
    }
}
