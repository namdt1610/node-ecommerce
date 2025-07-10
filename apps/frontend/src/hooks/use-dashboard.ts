import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard'

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
