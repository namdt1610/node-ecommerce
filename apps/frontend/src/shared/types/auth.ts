import { User } from './index'

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface AuthResponse {
    user: User
    accessToken: string
}

export interface UpdateProfileData {
    firstName?: string
    lastName?: string
    email?: string
    name?: string
    username?: string
    currentPassword?: string
    newPassword?: string
}

export interface LoginData {
    email: string
    password: string
}

export interface UserData {
    email: string
    password: string
    firstName?: string
    lastName?: string
}
