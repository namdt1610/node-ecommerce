'use client'

import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/admin'

export const useAdminDashboard = () => {
    const statsQuery = useQuery({
        queryKey: ['admin', 'dashboard', 'stats'],
        queryFn: () => adminApi.getDashboardStats(),
        select: (data) => data.data.data,
        refetchInterval: 30000, // Refresh every 30 seconds
    })

    const salesAnalyticsQuery = useQuery({
        queryKey: ['admin', 'dashboard', 'sales'],
        queryFn: () => adminApi.getSalesAnalytics(30),
        select: (data) => data.data.data,
        refetchInterval: 60000, // Refresh every minute
    })

    const userAnalyticsQuery = useQuery({
        queryKey: ['admin', 'dashboard', 'users'],
        queryFn: () => adminApi.getUserAnalytics(),
        select: (data) => data.data.data,
        refetchInterval: 300000, // Refresh every 5 minutes
    })

    const productAnalyticsQuery = useQuery({
        queryKey: ['admin', 'dashboard', 'products'],
        queryFn: () => adminApi.getProductAnalytics(),
        select: (data) => data.data.data,
        refetchInterval: 300000, // Refresh every 5 minutes
    })

    return {
        stats: statsQuery.data,
        salesAnalytics: salesAnalyticsQuery.data,
        userAnalytics: userAnalyticsQuery.data,
        productAnalytics: productAnalyticsQuery.data,
        isLoading:
            statsQuery.isLoading ||
            salesAnalyticsQuery.isLoading ||
            userAnalyticsQuery.isLoading ||
            productAnalyticsQuery.isLoading,
        isError:
            statsQuery.isError ||
            salesAnalyticsQuery.isError ||
            userAnalyticsQuery.isError ||
            productAnalyticsQuery.isError,
        error:
            statsQuery.error ||
            salesAnalyticsQuery.error ||
            userAnalyticsQuery.error ||
            productAnalyticsQuery.error,
        refetch: () => {
            statsQuery.refetch()
            salesAnalyticsQuery.refetch()
            userAnalyticsQuery.refetch()
            productAnalyticsQuery.refetch()
        },
    }
}

// Individual hooks for better performance and flexibility
export function useDashboardStats() {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const response = await adminApi.getDashboardStats()
            return response.data.data
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 30 * 1000, // 30 seconds
    })
}

export function useSalesAnalytics(days: number = 30) {
    return useQuery({
        queryKey: ['dashboard', 'sales-analytics', days],
        queryFn: async () => {
            const response = await adminApi.getSalesAnalytics(days)
            return response.data.data
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 30 * 1000, // 30 seconds
    })
}

export function useUserAnalytics() {
    return useQuery({
        queryKey: ['dashboard', 'user-analytics'],
        queryFn: async () => {
            const response = await adminApi.getUserAnalytics()
            return response.data.data
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export function useProductAnalytics() {
    return useQuery({
        queryKey: ['dashboard', 'product-analytics'],
        queryFn: async () => {
            const response = await adminApi.getProductAnalytics()
            return response.data.data
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export const useAdminUsers = (params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
}) => {
    return useQuery({
        queryKey: ['admin', 'users', params],
        queryFn: () => adminApi.getUsers(params),
        select: (data) => data.data,
    })
}

export const useAdminProducts = (params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
}) => {
    return useQuery({
        queryKey: ['admin', 'products', params],
        queryFn: () => adminApi.getProducts(params),
        select: (data) => data.data,
    })
}

export const useAdminOrders = (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
}) => {
    return useQuery({
        queryKey: ['admin', 'orders', params],
        queryFn: () => adminApi.getOrders(params),
        select: (data) => data.data,
    })
}

export const useAdminCategories = () => {
    return useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: () => adminApi.getCategories(),
        select: (data) => data.data,
    })
}

export const useAdminInventory = (params?: {
    page?: number
    limit?: number
    search?: string
    lowStock?: boolean
}) => {
    return useQuery({
        queryKey: ['admin', 'inventory', params],
        queryFn: () => adminApi.getInventory(params),
        select: (data) => data.data,
    })
}

export const useAdminReviews = (params?: {
    page?: number
    limit?: number
    productId?: string
    rating?: number
}) => {
    return useQuery({
        queryKey: ['admin', 'reviews', params],
        queryFn: () => adminApi.getReviews(params),
        select: (data) => data.data,
    })
}
