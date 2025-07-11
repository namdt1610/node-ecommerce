import api from './client'

export interface DashboardStats {
    totalRevenue: number
    totalOrders: number
    totalUsers: number
    totalProducts: number
    totalCategories: number
    todayRevenue: number
    todayOrders: number
    newUsersToday: number
    lowStockProducts: number
    orderStats: {
        pending: number
        processing: number
        shipped: number
        delivered: number
        cancelled: number
    }
}

export interface SalesAnalytics {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    conversionRate: number
    revenueData: {
        date: string
        revenue: number
        orders: number
    }[]
    topProducts: {
        id: string
        name: string
        image: string
        sales: number
        revenue: number
    }[]
    recentOrders: {
        id: string
        total: number
        status: string
        createdAt: string
        user: {
            id: string
            name: string
            email: string
        }
    }[]
}

export interface UserAnalytics {
    totalUsers: number
    newUsersThisMonth: number
    activeUsers: number
    userGrowth: {
        month: string
        users: number
    }[]
    usersByRole: {
        role: string
        count: number
    }[]
}

export interface ProductAnalytics {
    totalProducts: number
    activeProducts: number
    outOfStockProducts: number
    lowStockProducts: number
    productsByCategory: {
        category: string
        count: number
    }[]
    topSellingProducts: {
        id: string
        name: string
        sales: number
        revenue: number
    }[]
}

export const adminApi = {
    // Dashboard
    getDashboardStats: () =>
        api.get<{ data: DashboardStats }>('/dashboard/stats'),
    getSalesAnalytics: (days?: number) =>
        api.get<{ data: SalesAnalytics }>(
            `/dashboard/analytics/sales${days ? `?days=${days}` : ''}`
        ),
    getUserAnalytics: () =>
        api.get<{ data: UserAnalytics }>('/dashboard/analytics/users'),
    getProductAnalytics: () =>
        api.get<{ data: ProductAnalytics }>('/dashboard/analytics/products'),

    // Users Management
    getUsers: (params?: {
        page?: number
        limit?: number
        search?: string
        role?: string
    }) => api.get('/admin/users', { params }),
    getUserById: (id: string) => api.get(`/admin/users/${id}`),
    updateUser: (id: string, data: Record<string, unknown>) =>
        api.put(`/admin/users/${id}`, data),
    deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
    updateUserRole: (id: string, roleId: string) =>
        api.put(`/admin/users/${id}/role`, { roleId }),

    // Products Management
    getProducts: (params?: {
        page?: number
        limit?: number
        search?: string
        category?: string
    }) => api.get('/admin/products', { params }),
    getProductById: (id: string) => api.get(`/admin/products/${id}`),
    createProduct: (data: Record<string, unknown>) =>
        api.post('/admin/products', data),
    updateProduct: (id: string, data: Record<string, unknown>) =>
        api.put(`/admin/products/${id}`, data),
    deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
    updateProductStatus: (id: string, status: string) =>
        api.put(`/admin/products/${id}/status`, { status }),

    // Orders Management
    getOrders: (params?: {
        page?: number
        limit?: number
        search?: string
        status?: string
    }) => api.get('/admin/orders', { params }),
    getOrderById: (id: string) => api.get(`/admin/orders/${id}`),
    updateOrderStatus: (id: string, status: string) =>
        api.put(`/admin/orders/${id}/status`, { status }),

    // Categories Management
    getCategories: () => api.get('/admin/categories'),
    getCategoryById: (id: string) => api.get(`/admin/categories/${id}`),
    createCategory: (data: Record<string, unknown>) =>
        api.post('/admin/categories', data),
    updateCategory: (id: string, data: Record<string, unknown>) =>
        api.put(`/admin/categories/${id}`, data),
    deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),

    // Inventory Management
    getInventory: (params?: {
        page?: number
        limit?: number
        search?: string
        lowStock?: boolean
    }) => api.get('/admin/inventory', { params }),
    updateInventory: (
        id: string,
        data: { quantity: number; minStock?: number; maxStock?: number }
    ) => api.put(`/admin/inventory/${id}`, data),

    // Reviews Management
    getReviews: (params?: {
        page?: number
        limit?: number
        productId?: string
        rating?: number
    }) => api.get('/admin/reviews', { params }),
    updateReviewStatus: (id: string, status: 'approved' | 'rejected') =>
        api.put(`/admin/reviews/${id}/status`, { status }),
    deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`),
}
