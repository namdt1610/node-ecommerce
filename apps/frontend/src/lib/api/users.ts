import api from './client'
import { UserData, LoginData } from '@/shared/types'

export const userApi = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: Partial<UserData>) => api.put('/users/profile', data),
    register: (data: UserData) => api.post('/auth/register', data),
    login: (data: LoginData) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
}
