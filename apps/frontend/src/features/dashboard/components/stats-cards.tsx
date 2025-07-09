'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
    AlertCircle,
} from 'lucide-react'
import { DashboardStats } from '@/shared/types'

interface StatsCardsProps {
    stats: DashboardStats | undefined
    isLoading: boolean
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Skeleton className="h-4 w-[100px]" />
                            </CardTitle>
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-7 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!stats) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-6">
                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        No data available
                    </p>
                </CardContent>
            </Card>
        )
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num)
    }

    const statsConfig = [
        {
            title: 'Tổng Doanh Thu',
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
        },
        {
            title: 'Đơn Hàng Hôm Nay',
            value: formatNumber(stats.todayOrders),
            icon: ShoppingCart,
        },
        {
            title: 'Tổng Người Dùng',
            value: formatNumber(stats.totalUsers),
            icon: Users,
        },
        {
            title: 'Tổng Sản Phẩm',
            value: formatNumber(stats.totalProducts),
            icon: Package,
        },
        {
            title: 'Doanh Thu Hôm Nay',
            value: formatCurrency(stats.todayRevenue),
            icon: TrendingUp,
        },
        {
            title: 'Đơn Chờ Xử Lý',
            value: formatNumber(stats.pendingOrders),
            icon: ShoppingCart,
        },
        {
            title: 'Users Mới Hôm Nay',
            value: formatNumber(stats.newUsersToday),
            icon: Users,
        },
        {
            title: 'Sản Phẩm Sắp Hết',
            value: formatNumber(stats.lowStockProducts),
            icon: AlertCircle,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsConfig.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
