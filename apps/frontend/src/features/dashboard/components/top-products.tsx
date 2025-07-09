'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SalesAnalytics } from '@/shared/types'
import { TrendingUp, Package2 } from 'lucide-react'

interface TopProductsProps {
    salesData: SalesAnalytics | undefined
    isLoading: boolean
}

export function TopProducts({ salesData, isLoading }: TopProductsProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Sản Phẩm Bán Chạy
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-4"
                            >
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-3 w-[100px]" />
                                </div>
                                <Skeleton className="h-4 w-[80px]" />
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

    const topProducts = salesData?.topProducts || []

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sản Phẩm Bán Chạy
                </CardTitle>
            </CardHeader>
            <CardContent>
                {topProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Package2 className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Chưa có dữ liệu sản phẩm
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-[400px]">
                        <div className="space-y-4">
                            {topProducts.slice(0, 5).map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {product.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">
                                                {product.sales} bán
                                            </Badge>
                                            <span className="text-sm font-medium text-green-600">
                                                {formatCurrency(
                                                    product.revenue
                                                )}
                                            </span>
                                        </div>
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
