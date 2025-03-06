import mongoose, { Model, Document, Schema, Types } from 'mongoose'

interface IPermission {
    resource: string
    actions: string[]
}

interface IFavorite {
    _id: Types.ObjectId
}

export interface IUser extends Document {
    _id: Types.ObjectId
    avatar?: string
    status: 'active' | 'inactive'
    name: string
    email: string
    username?: string
    password: string
    role: 'user' | 'admin' | 'moderator'
    permissions?: IPermission[]
    favorites: IFavorite[]
}

// Interface cho User Model
interface IUserModel extends Model<IUser> {
    signup(email: string, password: string): Promise<IUser>
    login(email: string, password: string, res: any): Promise<void>
    hasPermission(
        userId: string,
        resource: string,
        action: string
    ): Promise<boolean>
}

// Khai báo Schema
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
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user',
        },
        permissions: [
            {
                resource: { type: String, required: true }, // Ví dụ: 'product', 'order'
                actions: [{ type: String, required: true }], // ['read', 'write']
            },
        ],
        favorites: [
            {
                type: Types.ObjectId,
                ref: 'Product',
            },
        ],
    },
    { timestamps: true }
)

const User = mongoose.model<IUser, IUserModel>('User', userSchema)
export default User
