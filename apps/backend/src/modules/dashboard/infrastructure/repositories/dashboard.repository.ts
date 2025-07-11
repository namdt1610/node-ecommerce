import { PrismaClient, OrderStatus } from '@prisma/client'
import {
    IDashboardRepository,
    DashboardStats,
    SalesAnalytics,
    UserAnalytics,
    ProductAnalytics,
    RevenueData,
    TopProduct,
    RecentOrder,
} from '../../domain/interfaces/dashboard-repository.interface'

export class DashboardRepository implements IDashboardRepository {
    constructor(private prisma: PrismaClient) {}

    async getDashboardStats(): Promise<DashboardStats> {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const [
            totalRevenue,
            totalOrders,
            totalUsers,
            totalProducts,
            totalCategories,
            orderStats,
            todayStats,
            newUsersToday,
            lowStockProducts,
        ] = await Promise.all([
            // Total revenue from delivered orders
            this.prisma.order.aggregate({
                where: { status: OrderStatus.DELIVERED },
                _sum: { total: true },
            }),

            // Total orders
            this.prisma.order.count(),

            // Total users
            this.prisma.user.count(),

            // Total products
            this.prisma.product.count(),

            // Total categories
            this.prisma.category.count(),

            // Order status counts
            this.prisma.order.groupBy({
                by: ['status'],
                _count: { id: true },
            }),

            // Today's stats
            Promise.all([
                this.prisma.order.aggregate({
                    where: {
                        status: OrderStatus.DELIVERED,
                        createdAt: { gte: today, lt: tomorrow },
                    },
                    _sum: { total: true },
                }),
                this.prisma.order.count({
                    where: { createdAt: { gte: today, lt: tomorrow } },
                }),
            ]),

            // New users today
            this.prisma.user.count({
                where: { createdAt: { gte: today, lt: tomorrow } },
            }),

            // Low stock products (inventory quantity < 10)
            this.prisma.inventory.count({
                where: { quantity: { lt: 10 } },
            }),
        ])

        const orderStatusMap = orderStats.reduce(
            (acc, stat) => {
                acc[stat.status] = stat._count.id
                return acc
            },
            {} as Record<string, number>
        )

        return {
            totalRevenue: totalRevenue._sum?.total || 0,
            totalOrders,
            totalUsers,
            totalProducts,
            totalCategories,
            pendingOrders: orderStatusMap['PENDING'] || 0,
            completedOrders: orderStatusMap['DELIVERED'] || 0,
            cancelledOrders: orderStatusMap['CANCELLED'] || 0,
            todayRevenue: todayStats[0]._sum?.total || 0,
            todayOrders: todayStats[1],
            newUsersToday,
            lowStockProducts,
        }
    }

    async getSalesAnalytics(days = 30): Promise<SalesAnalytics> {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const [dailyRevenue, topProducts, recentOrders] = await Promise.all([
            // Daily revenue for the period
            this.prisma.$queryRaw<any[]>`
                SELECT 
                    DATE("createdAt") as date,
                    COALESCE(SUM(CASE WHEN status = 'DELIVERED' THEN total ELSE 0 END), 0) as revenue,
                    COUNT(*) as orders
                FROM orders 
                WHERE "createdAt" >= ${startDate} AND "createdAt" <= ${endDate}
                GROUP BY DATE("createdAt")
                ORDER BY date DESC
            `,

            // Top products by sales
            this.prisma.$queryRaw<any[]>`
                SELECT 
                    p.id,
                    p.name,
                    COALESCE((p.images->0->'url')::text, '') as image,
                    COALESCE(SUM(oi.quantity), 0) as sales,
                    COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
                FROM products p
                LEFT JOIN order_items oi ON p.id = oi."productId"
                LEFT JOIN orders o ON oi."orderId" = o.id AND o.status = 'DELIVERED'
                GROUP BY p.id, p.name, p.images
                ORDER BY revenue DESC
                LIMIT 10
            `,

            // Recent orders
            this.prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            }),
        ])

        // Format daily revenue data
        const formattedDailyRevenue: RevenueData[] = dailyRevenue.map(
            (row) => ({
                date: row.date.toISOString().split('T')[0],
                revenue: parseFloat(row.revenue) || 0,
                orders: parseInt(row.orders) || 0,
            })
        )

        // Format top products
        const formattedTopProducts: TopProduct[] = topProducts.map(
            (product) => ({
                id: product.id,
                name: product.name,
                sales: parseInt(product.sales) || 0,
                revenue: parseFloat(product.revenue) || 0,
                image: product.image
                    ? product.image.replace(/"/g, '')
                    : undefined,
            })
        )

        // Format recent orders
        const formattedRecentOrders: RecentOrder[] = recentOrders.map(
            (order) => ({
                id: order.id,
                userId: order.userId,
                userName: order.user.name || '',
                userEmail: order.user.email,
                status: order.status,
                total: order.total,
                createdAt: order.createdAt,
            })
        )

        return {
            dailyRevenue: formattedDailyRevenue,
            weeklyRevenue: this.groupByWeek(formattedDailyRevenue),
            monthlyRevenue: this.groupByMonth(formattedDailyRevenue),
            topProducts: formattedTopProducts,
            recentOrders: formattedRecentOrders,
        }
    }

    async getUserAnalytics(): Promise<UserAnalytics> {
        const now = new Date()
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), 1)

        const [totalUsers, newUsersThisMonth, userGrowth] = await Promise.all([
            this.prisma.user.count(),

            this.prisma.user.count({
                where: { createdAt: { gte: thisMonth } },
            }),

            this.prisma.$queryRaw<any[]>`
                SELECT 
                    TO_CHAR("createdAt", 'YYYY-MM') as month,
                    COUNT(*) as users
                FROM users 
                WHERE "createdAt" >= ${lastYear}
                GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
                ORDER BY month
            `,
        ])

        return {
            totalUsers,
            activeUsers: totalUsers, // Could implement last login tracking
            newUsersThisMonth,
            userGrowth: userGrowth.map((row) => ({
                month: row.month,
                users: parseInt(row.users),
            })),
        }
    }

    async getProductAnalytics(): Promise<ProductAnalytics> {
        const [
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
            topCategories,
            recentProducts,
        ] = await Promise.all([
            this.prisma.product.count(),

            // Low stock products (inventory quantity < 10 but > 0)
            this.prisma.inventory.count({
                where: {
                    quantity: { lt: 10, gt: 0 },
                },
            }),

            // Out of stock products (inventory quantity = 0)
            this.prisma.inventory.count({
                where: { quantity: 0 },
            }),

            this.prisma.category.findMany({
                include: {
                    _count: {
                        select: { products: true },
                    },
                },
                orderBy: {
                    products: { _count: 'desc' },
                },
                take: 10,
            }),

            this.prisma.product.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, createdAt: true },
            }),
        ])

        return {
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
            topCategories: topCategories.map((cat) => ({
                name: cat.name,
                count: cat._count.products,
            })),
            recentProducts,
        }
    }

    async getRecentActivity(): Promise<any[]> {
        // Get recent activities from different sources
        const [recentOrders, recentUsers, recentProducts] = await Promise.all([
            this.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true } } },
            }),

            this.prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, email: true, createdAt: true },
            }),

            this.prisma.product.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, createdAt: true },
            }),
        ])

        const activities = [
            ...recentOrders.map((order) => ({
                type: 'order',
                message: `New order #${order.id.slice(0, 8)} by ${order.user.name}`,
                timestamp: order.createdAt,
                data: order,
            })),
            ...recentUsers.map((user) => ({
                type: 'user',
                message: `New user registered: ${user.name}`,
                timestamp: user.createdAt,
                data: user,
            })),
            ...recentProducts.map((product) => ({
                type: 'product',
                message: `New product added: ${product.name}`,
                timestamp: product.createdAt,
                data: product,
            })),
        ]

        return activities
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 20)
    }

    private groupByWeek(dailyData: RevenueData[]): RevenueData[] {
        const weeklyMap = new Map<string, { revenue: number; orders: number }>()

        dailyData.forEach((day) => {
            const date = new Date(day.date)
            const weekStart = new Date(date)
            weekStart.setDate(date.getDate() - date.getDay())
            const weekKey = weekStart.toISOString().split('T')[0]

            const existing = weeklyMap.get(weekKey) || { revenue: 0, orders: 0 }
            weeklyMap.set(weekKey, {
                revenue: existing.revenue + day.revenue,
                orders: existing.orders + day.orders,
            })
        })

        return Array.from(weeklyMap.entries()).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders,
        }))
    }

    private groupByMonth(dailyData: RevenueData[]): RevenueData[] {
        const monthlyMap = new Map<
            string,
            { revenue: number; orders: number }
        >()

        dailyData.forEach((day) => {
            const date = new Date(day.date)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`

            const existing = monthlyMap.get(monthKey) || {
                revenue: 0,
                orders: 0,
            }
            monthlyMap.set(monthKey, {
                revenue: existing.revenue + day.revenue,
                orders: existing.orders + day.orders,
            })
        })

        return Array.from(monthlyMap.entries()).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders,
        }))
    }
}
