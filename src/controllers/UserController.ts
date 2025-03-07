import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/UserModel'
import mongoose from 'mongoose'

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params

    try {
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { user, email, password, name, role, status, phone, address } =
        req.body

    console.log('User Data:', req.body)

    try {
        // Chuẩn bị dữ liệu cập nhật, bỏ qua những thuộc tính không thay đổi
        const updatedData: any = {
            email,
            name,
            role,
            status,
            phone,
            address,
        }

        // Chỉ hash mật khẩu nếu có sự thay đổi
        if (password) {
            const updatedPassword = await bcrypt.hash(password, 12)
            updatedData.password = updatedPassword
        }

        // Cập nhật thông tin người dùng
        const updatedUser = await User.findByIdAndUpdate(user, updatedData, {
            new: true,
        })

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        // Trả về thông tin người dùng đã cập nhật
        res.status(200).json(updatedUser.toJSON())
    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).json({ message: 'Could not update user' })
    }
}

export const deleteUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params

    try {
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Could not delete user' })
    }
}

export const getFavoritesById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params
        const favorites = await User.findById(id).populate('favorites')
        console.log('Favorites:', favorites)
        res.status(200).json(favorites?.favorites)
    } catch (error) {
        res.status(500).json({ message: 'Could not fetch favorites' })
    }
}

export const addToFavorites = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { userId, productId } = req.body
    if (!userId) {
        res.status(400).json({ message: 'User not found' })
        return
    }

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        if (user.favorites.includes(productId)) {
            res.status(400).json({ message: 'Product already in favorites' })
            return
        }

        user.favorites.push(productId)
        await user.save()
        res.status(200).json({
            message: 'Product added to favorites successfully',
            user,
        })
        return
    } catch (error) {
        res.status(500).json({ message: 'Could not add to favorites' })
        return
    }
}

export const resetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email, password } = req.body

    try {
        const updatedPassword = await bcrypt.hash(password, 12)
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: updatedPassword },
            { new: true }
        )
    } catch (error) {}
}
