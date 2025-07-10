'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { SalesAnalytics } from '@/shared/types'
import { formatPrice } from '@/shared/utils'

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
                        <div className="space-y-4">
                    {topProducts.map((product, index) => (
                                <div
                                    key={product.id}
                            className="flex items-center space-x-4"
                                >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium">
                                {index + 1}
                                    </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                            {product.name}
                                        </p>
                                <p className="text-sm text-muted-foreground">
                                    {product.sales} đã bán
                                </p>
                                        </div>
                            <div className="text-right">
                                <p className="font-medium">
                                    {formatPrice(product.revenue)}
                                </p>
                                    </div>
                                </div>
                            ))}
                        </div>
            </CardContent>
        </Card>
    )
}
