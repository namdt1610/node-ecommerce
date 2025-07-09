import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    productApi,
    categoryApi,
    cartApi,
    userApi,
    orderApi,
    dashboardApi,
} from '@/lib/api'
import { UpdateProfileData } from '@/shared/types'

// Product hooks
export const useProducts = (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productApi.getProducts(params),
        select: (response) => response.data, // Return the full API response structure
    })
}

export const useProduct = (id: string) => {
    console.log('useProduct called with id:', id)

    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            console.log('useProduct queryFn called with id:', id)
            console.log(
                'Making API call to:',
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api'}/products/${id}`
            )
            try {
                const response = await productApi.getProduct(id)
                console.log('API response received:', response)
                console.log('Response data:', response.data)
                console.log('Response status:', response.status)
                return response
            } catch (error) {
                console.error('API error in queryFn:', error)
                if (error instanceof Error) {
                    console.error('Error message:', error.message)
                }
                if (error && typeof error === 'object' && 'response' in error) {
                    console.error(
                        'Error response:',
                        (error as { response: unknown }).response
                    )
                }
                throw error
            }
        },
        select: (axiosResponse) => {
            console.log(
                'useProduct select called with axiosResponse:',
                axiosResponse
            )
            console.log('Axios response data:', axiosResponse.data)
            console.log('API success field:', axiosResponse.data.success)
            console.log('API data field:', axiosResponse.data.data)
            // The API returns { success: true, data: product } wrapped in axios response
            return axiosResponse.data.data
        },
        enabled: !!id,
        retry: 1,
        retryDelay: 1000,
    })
}

// Category hooks
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryApi.getCategories(),
        select: (data) => data.data,
    })
}

// Cart hooks
export const useCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: () => cartApi.getCart(),
        select: (data) => data.data,
    })
}

export const useAddToCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            productId,
            quantity,
        }: {
            productId: string
            quantity: number
        }) => cartApi.addToCart(productId, quantity),
        onSuccess: () => {
            // Invalidate cart queries to refetch
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            itemId,
            quantity,
        }: {
            itemId: string
            quantity: number
        }) => cartApi.updateCartItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (itemId: string) => cartApi.removeFromCart(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

// Auth hooks
export const useLogin = () => {
    return useMutation({
        mutationFn: (credentials: { email: string; password: string }) =>
            userApi.login(credentials),
        onSuccess: (data) => {
            // Store token in localStorage
            if (data.data.token) {
                localStorage.setItem('token', data.data.token)
            }
        },
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: (userData: {
            email: string
            password: string
            firstName: string
            lastName: string
        }) => userApi.register(userData),
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

export const useOrder = (id: string) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => orderApi.getOrder(id),
        select: (data) => data.data,
        enabled: !!id,
    })
}

// Order/Checkout hooks
export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (orderData: {
            items: Array<{
                productId: string
                quantity: number
                price: number
            }>
            shippingAddress: string
            paymentMethod: string
        }) => orderApi.createOrder(orderData),
        onSuccess: () => {
            // Invalidate cart and orders queries
            queryClient.invalidateQueries({ queryKey: ['cart'] })
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
    })
}

export const useClearCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => cartApi.clearCart(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: () => orderApi.getOrders(),
        select: (data) => data.data,
    })
}

// Dashboard hooks
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: () => dashboardApi.getStats(),
        select: (response) => response.data.data,
        refetchInterval: 30000, // Refetch every 30 seconds
    })
}

export const useSalesAnalytics = (days?: number) => {
    return useQuery({
        queryKey: ['dashboard', 'sales', days],
        queryFn: () => dashboardApi.getSalesAnalytics(days),
        select: (response) => response.data.data,
        refetchInterval: 60000, // Refetch every minute
    })
}

export const useUserAnalytics = () => {
    return useQuery({
        queryKey: ['dashboard', 'users'],
        queryFn: () => dashboardApi.getUserAnalytics(),
        select: (response) => response.data.data,
        refetchInterval: 60000,
    })
}

export const useProductAnalytics = () => {
    return useQuery({
        queryKey: ['dashboard', 'products'],
        queryFn: () => dashboardApi.getProductAnalytics(),
        select: (response) => response.data.data,
        refetchInterval: 60000,
    })
}

export const useRecentActivity = () => {
    return useQuery({
        queryKey: ['dashboard', 'activity'],
        queryFn: () => dashboardApi.getRecentActivity(),
        select: (response) => response.data.data,
        refetchInterval: 15000, // Refetch every 15 seconds for activity
    })
}

export const useAllDashboardData = (days?: number) => {
    return useQuery({
        queryKey: ['dashboard', 'all', days],
        queryFn: () => dashboardApi.getAllData(days),
        select: (response) => response.data.data,
        refetchInterval: 30000,
    })
}

export const useRefreshDashboard = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => dashboardApi.refreshDashboard(),
        onSuccess: () => {
            // Invalidate all dashboard queries
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}
