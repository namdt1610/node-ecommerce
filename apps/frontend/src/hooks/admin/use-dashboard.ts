import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/admin'

export function useDashboardStats() {
    return useQuery({
        queryKey: ['admin', 'dashboard', 'stats'],
        queryFn: async () => {
            const response = await adminApi.getDashboardStats()
            return response.data.data
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    })
}

export function useSalesAnalytics(days?: number) {
    return useQuery({
        queryKey: ['admin', 'dashboard', 'sales', days],
        queryFn: async () => {
            const response = await adminApi.getSalesAnalytics(days)
            return response.data.data
        },
        refetchInterval: 60000, // Refetch every minute
    })
}

export function useUserAnalytics() {
    return useQuery({
        queryKey: ['admin', 'dashboard', 'users'],
        queryFn: async () => {
            const response = await adminApi.getUserAnalytics()
            return response.data.data
        },
        refetchInterval: 60000,
    })
}

export function useProductAnalytics() {
    return useQuery({
        queryKey: ['admin', 'dashboard', 'products'],
        queryFn: async () => {
            const response = await adminApi.getProductAnalytics()
            return response.data.data
        },
        refetchInterval: 60000,
    })
}
