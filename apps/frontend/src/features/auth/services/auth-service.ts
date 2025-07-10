import api from '@/lib/api'
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User,
} from '@/shared/types'
import { API_ENDPOINTS } from '@/shared/constants'

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data)
        return response.data
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data)
        return response.data
    },

    logout: async (): Promise<void> => {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT)
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get(API_ENDPOINTS.AUTH.PROFILE)
        return response.data
    },
}
