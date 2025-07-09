import axios from 'axios'
import { ProductData, CategoryData, UserData, LoginData, OrderData } from '@/shared/types'

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Product API
export const productApi = {
    getProducts: (params?: {
        page?: number
        limit?: number
        category?: string
        search?: string
    }) => {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.append('page', params.page.toString())
        if (params?.limit) searchParams.append('limit', params.limit.toString())
        if (params?.category) searchParams.append('category', params.category)
        if (params?.search) searchParams.append('search', params.search)

        return api.get(`/products?${searchParams.toString()}`)
    },
    getProduct: (id: string) => api.get(`/products/${id}`),
    createProduct: (data: ProductData) => api.post('/products', data),
    updateProduct: (id: string, data: Partial<ProductData>) =>
        api.put(`/products/${id}`, data),
    deleteProduct: (id: string) => api.delete(`/products/${id}`),
}

// Category API
export const categoryApi = {
    getCategories: () => api.get('/categories'),
    getCategory: (id: string) => api.get(`/categories/${id}`),
    createCategory: (data: CategoryData) => api.post('/categories', data),
    updateCategory: (id: string, data: Partial<CategoryData>) =>
        api.put(`/categories/${id}`, data),
    deleteCategory: (id: string) => api.delete(`/categories/${id}`),
}

// User API
export const userApi = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: Partial<UserData>) => api.put('/users/profile', data),
    register: (data: UserData) => api.post('/auth/register', data),
    login: (data: LoginData) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
}

// Cart API
export const cartApi = {
    getCart: () => api.get('/cart'),
    addToCart: (productId: string, quantity: number) =>
        api.post('/cart/add', { productId, quantity }),
    updateCartItem: (itemId: string, quantity: number) =>
        api.put(`/cart/items/${itemId}`, { quantity }),
    removeFromCart: (itemId: string) => api.delete(`/cart/items/${itemId}`),
    clearCart: () => api.delete('/cart'),
}

// Order API
export const orderApi = {
    getOrders: () => api.get('/orders'),
    getOrder: (id: string) => api.get(`/orders/${id}`),
    createOrder: (data: OrderData) => api.post('/orders', data),
    updateOrderStatus: (id: string, status: string) =>
        api.put(`/orders/${id}/status`, { status }),
}

// Dashboard API
export const dashboardApi = {
    getStats: () => api.get('/dashboard/stats'),
    getSalesAnalytics: (days?: number) =>
        api.get(`/dashboard/analytics/sales${days ? `?days=${days}` : ''}`),
    getUserAnalytics: () => api.get('/dashboard/analytics/users'),
    getProductAnalytics: () => api.get('/dashboard/analytics/products'),
    getRecentActivity: () => api.get('/dashboard/activity'),
    getAllData: (days?: number) =>
        api.get(`/dashboard/all${days ? `?days=${days}` : ''}`),
    refreshDashboard: () => api.post('/dashboard/refresh'),
    getDashboardStatus: () => api.get('/dashboard/status'),
}

export default api
