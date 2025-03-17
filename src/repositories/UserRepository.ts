import mongoose from 'mongoose'
import User from '@/models/UserModel'

export class UserRepository {
    private session: mongoose.ClientSession | null = null

    setSession(session: mongoose.ClientSession) {
        this.session = session
    }

    async findByEmail(email: string) {
        return User.findOne({ email })
            .select('+password')
            .lean()
            .session(this.session as any)
    }

    async findById(userId: string) {
        return User.findById(userId).session(this.session as any)
    }

    async createUser(email: string, password: string, role: string = 'user') {
        const [user] = await User.create([{ email, password, role }], {
            session: this.session as any,
        })
        return user
        // Using array because mongoose require array in transactions
    }

    async updateUser(userId: string, updateData: any) {
        return User.findByIdAndUpdate(userId, updateData, {
            new: true,
        }).session(this.session as any)
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

    async countTotal() {
        return User.countDocuments().session(this.session as any)
    }

    async countActive() {
        return User.countDocuments({ isActive: true }).session(
            this.session as any
        )
    }

    async getUserFavorites(userId: string) {
        return User.findById(userId)
            .select('favorites')
            .populate('favorites')
            .session(this.session as any)
    }

    async addToFavorites(userId: string, productId: string) {
        return User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: productId } },
            { new: true }
        ).session(this.session as any)
    }
}
