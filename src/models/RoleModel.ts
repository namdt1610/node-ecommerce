import mongoose, { Document, Schema } from 'mongoose'

export interface IRole extends Document {
    _id: Schema.Types.ObjectId
    name: string
    permissions: string[]
}

const RoleSchema = new Schema({
    name: { type: String, require: true, unique: true },
    permissions: {
        type: [String],
        require: true,
        default: [],
    },
})

export default mongoose.model<IRole>('Role', RoleSchema)
