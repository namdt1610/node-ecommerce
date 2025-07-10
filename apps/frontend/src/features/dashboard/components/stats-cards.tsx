'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
    AlertCircle,
    DollarSign,
    Package,
    ShoppingCart,
    Users,
} from 'lucide-react'
import { DashboardStats } from '@/shared/types'
import { formatPrice, formatNumber } from '@/shared/utils'

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

    const statsCards = [
        {
            title: 'Tổng Doanh Thu',
            value: formatPrice(stats.totalRevenue),
            icon: DollarSign,
        },
        {
            title: 'Tổng Đơn Hàng',
            value: formatNumber(stats.totalOrders),
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
            value: formatPrice(stats.todayRevenue),
            icon: DollarSign,
        },
        {
            title: 'Đơn Hôm Nay',
            value: formatNumber(stats.todayOrders),
            icon: ShoppingCart,
        },
        {
            title: 'Đơn Chờ Xử Lý',
            value: formatNumber(stats.pendingOrders),
            icon: Package,
        },
        {
            title: 'Đơn Hoàn Thành',
            value: formatNumber(stats.completedOrders),
            icon: ShoppingCart,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
