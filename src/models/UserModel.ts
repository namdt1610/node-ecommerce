import mongoose, { Model, Document, Schema } from 'mongoose'
import { IRole } from './RoleModel'

interface IFavorite {
    _id: Schema.Types.ObjectId
}

export interface IUser extends Document {
    _id: string
    avatar?: string
    status: 'active' | 'inactive'
    name: string
    email: string
    username?: string
    password: string
    role: Schema.Types.ObjectId | IRole
    favorites: IFavorite[]
    updatedAt: Date
    createdAt: Date
    resetPasswordToken?: string
    resetPasswordExpires?: Date
}

interface IUserModel extends Model<IUser> {
    signup(email: string, password: string): Promise<IUser>
    login(email: string, password: string, res: any): Promise<void>
    hasPermission(
        userId: string,
        resource: string,
        action: string
    ): Promise<boolean>
}

const userSchema = new Schema<IUser>(
    {
        avatar: { type: String, default: null },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        name: { type: String, default: 'New User' },
        email: { type: String, required: true, unique: true },
        username: { type: String, default: null },
        password: { type: String, required: true, select: false },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
        },
        favorites: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        resetPasswordToken: { type: String, required: false },
        resetPasswordExpires: { type: Date, required: false },
    },
    { timestamps: true }
)

userSchema.pre('save', async function (next) {
    if (!this.role) {
        const defaultRole = await mongoose
            .model('Role')
            .findOne({ name: 'user' })
        if (!defaultRole) {
            throw new Error(
                "Default role 'user' not found. Please add it to the database."
            )
        }
        this.role = defaultRole._id
    }
    next()
})

const User = mongoose.model<IUser, IUserModel>('User', userSchema)
export default User
