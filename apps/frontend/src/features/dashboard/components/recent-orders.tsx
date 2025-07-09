'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SalesAnalytics } from '@/shared/types'
import { Clock } from 'lucide-react'

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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'default'
            case 'pending':
                return 'secondary'
            case 'cancelled':
                return 'destructive'
            case 'processing':
                return 'outline'
            default:
                return 'secondary'
        }
    }

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'Hoàn thành'
            case 'pending':
                return 'Chờ xử lý'
            case 'cancelled':
                return 'Đã hủy'
            case 'processing':
                return 'Đang xử lý'
            default:
                return status
        }
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
                {recentOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Clock className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Chưa có đơn hàng nào
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-[400px]">
                        <div className="space-y-4">
                            {recentOrders.slice(0, 10).map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-b-0"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                                #{order.id.slice(-6)}
                                            </span>
                                            <Badge
                                                variant={getStatusVariant(
                                                    order.status
                                                )}
                                            >
                                                {getStatusText(order.status)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {order.userName} • {order.userEmail}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {formatCurrency(order.total)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}
