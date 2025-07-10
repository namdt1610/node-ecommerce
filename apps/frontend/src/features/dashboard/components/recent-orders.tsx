'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { SalesAnalytics } from '@/shared/types'
import {
    formatPrice,
    formatDate,
    getOrderStatusLabel,
    getOrderStatusColor,
} from '@/shared/utils'

interface RecentOrdersProps {
    salesData: SalesAnalytics | undefined
    isLoading: boolean
}

export function RecentOrders({ salesData, isLoading }: RecentOrdersProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Đơn Hàng Gần Đây
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between"
                            >
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-3 w-[150px]" />
                                </div>
                                <div className="text-right space-y-2">
                                    <Skeleton className="h-4 w-[80px]" />
                                    <Skeleton className="h-3 w-[60px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    const recentOrders = salesData?.recentOrders || []

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Đơn Hàng Gần Đây
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium">#{order.id}</p>
                                <p className="text-sm text-muted-foreground">
                                    {order.userName} •{' '}
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">
                                    {formatPrice(order.total)}
                                </p>
                                <Badge
                                    variant={
                                        getOrderStatusColor(order.status) as
                                            | 'default'
                                            | 'secondary'
                                            | 'destructive'
                                            | 'outline'
                                    }
                                >
                                    {getOrderStatusLabel(order.status)}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
