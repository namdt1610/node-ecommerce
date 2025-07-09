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

export interface SalesAnalytics {
    dailyRevenue: Array<{
        date: string
        revenue: number
        orders: number
    }>
    weeklyRevenue: Array<{
        week: string
        revenue: number
        orders: number
    }>
    monthlyRevenue: Array<{
        month: string
        revenue: number
        orders: number
    }>
    topProducts: Array<{
        id: string
        name: string
        sales: number
        revenue: number
        image?: string
    }>
    recentOrders: Array<{
        id: string
        userId: string
        userName: string
        userEmail: string
        status: string
        total: number
        createdAt: string
    }>
}

export interface UserAnalytics {
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
    userGrowth: Array<{
        month: string
        newUsers: number
        totalUsers: number
    }>
}

export interface ProductAnalytics {
    totalProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    topCategories: Array<{
        id: string
        name: string
        productCount: number
    }>
    recentProducts: Array<{
        id: string
        name: string
        price: number
        createdAt: string
    }>
}

export interface RecentActivity {
    orders: Array<{
        id: string
        type: 'ORDER_CREATED' | 'ORDER_UPDATED' | 'ORDER_CANCELLED'
        description: string
        timestamp: string
        userId?: string
        userName?: string
    }>
    users: Array<{
        id: string
        type: 'USER_REGISTERED' | 'USER_UPDATED'
        description: string
        timestamp: string
        userId: string
        userName: string
    }>
    products: Array<{
        id: string
        type: 'PRODUCT_CREATED' | 'PRODUCT_UPDATED' | 'PRODUCT_DELETED'
        description: string
        timestamp: string
        productId: string
        productName: string
    }>
}
