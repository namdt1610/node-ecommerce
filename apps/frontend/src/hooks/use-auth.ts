import { useQuery, useMutation } from '@tanstack/react-query'
import { userApi } from '@/lib/api/users'
import { UpdateProfileData } from '@/shared/types'

// Auth hooks
export const useLogin = () => {
    return useMutation({
        mutationFn: (credentials: { email: string; password: string }) =>
            userApi.login(credentials),
        onSuccess: (data) => {
            // Store token in localStorage
            if (data.data.accessToken) {
                localStorage.setItem('token', data.data.accessToken)
            }
        },
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: (userData: {
            email: string
            password: string
            confirmPassword: string
        }) => userApi.register(userData),
        onSuccess: (data) => {
            // Store token in localStorage
            if (data.data.accessToken) {
                localStorage.setItem('token', data.data.accessToken)
            }
        },
    })
}

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => userApi.getProfile(),
        select: (data) => data.data,
        retry: false,
    })
}

export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: (data: UpdateProfileData) => userApi.updateProfile(data),
    })
}
