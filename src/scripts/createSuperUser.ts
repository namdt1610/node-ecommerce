import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '@/models/UserModel'
import Role from '@/models/RoleModel'
import dotenv from 'dotenv'

dotenv.config()

const createSuperUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!)

        // Check if admin role exists, create if not
        let adminRole = await Role.findOne({ name: 'admin' })
        if (!adminRole) {
            adminRole = await Role.create({
                name: 'admin',
                permissions: ['*'], // All permissions
            })
        }

        const email = 'nam.dt161@gmail.com'
        const password = 'adminpro123' // Change this!

        // Check if admin user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            console.log('Superuser already exists')
            process.exit(0)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create admin user
        const superUser = await User.create({
            email,
            password: hashedPassword,
            name: 'Admin User',
            role: adminRole._id,
            isActive: true,
        })

        console.log('Superuser created successfully:', superUser.email)
    } catch (error) {
        console.error('Error creating superuser:', error)
    } finally {
        await mongoose.disconnect()
    }
}

createSuperUser()
