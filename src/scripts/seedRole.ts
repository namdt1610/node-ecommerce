import mongoose from 'mongoose'
import Role from '@/models/RoleModel'
import dotenv from 'dotenv'

dotenv.config()

const seedRoles = async () => {
    await mongoose.connect(process.env.MONGO_URI as string)

    await Role.deleteMany() // Xóa dữ liệu cũ

    const roles = [
        {
            name: 'admin',
            permissions: ['users:*'],
        },
        {
            name: 'super_admin',
            permissions: ['*'], // Toàn quyền hệ thống
        },
        {
            name: 'user',
            permissions: ['users:read'],
        },
    ]

    await Role.insertMany(roles)
    console.log('Seeded roles successfully!')

    mongoose.disconnect()
}

seedRoles()
