export interface DashboardStats {
    totalRevenue: number
    totalOrders: number
    totalUsers: number
    totalProducts: number
    totalCategories: number
    pendingOrders: number
    completedOrders: number
    cancelledOrders: number
    todayRevenue: number
    todayOrders: number
    newUsersToday: number
    lowStockProducts: number
}

export interface RevenueData {
    date: string
    revenue: number
    orders: number
}

export interface TopProduct {
    id: string
    name: string
    sales: number
    revenue: number
    image?: string
}

export interface RecentOrder {
    id: string
    userId: string
    userName: string
    userEmail: string
    status: string
    total: number
    createdAt: Date
}

export interface SalesAnalytics {
    dailyRevenue: RevenueData[]
    weeklyRevenue: RevenueData[]
    monthlyRevenue: RevenueData[]
    topProducts: TopProduct[]
    recentOrders: RecentOrder[]
}

export interface UserAnalytics {
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
    userGrowth: { month: string; users: number }[]
}

export interface ProductAnalytics {
    totalProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    topCategories: { name: string; count: number }[]
    recentProducts: { id: string; name: string; createdAt: Date }[]
}

export interface IDashboardRepository {
    getDashboardStats(): Promise<DashboardStats>
    getSalesAnalytics(days?: number): Promise<SalesAnalytics>
    getUserAnalytics(): Promise<UserAnalytics>
    getProductAnalytics(): Promise<ProductAnalytics>
    getRecentActivity(): Promise<any[]>
}
