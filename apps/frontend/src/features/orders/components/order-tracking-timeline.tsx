'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Package,
    Truck,
    CheckCircle,
    PlayCircle,
    Clock,
    AlertCircle,
} from 'lucide-react'
import { TrackingHistoryItem } from '@/shared/types'
import {
    formatDateTime,
    getOrderStatusLabel,
    getShippingStatusLabel,
} from '@/shared/utils'

interface OrderTrackingTimelineProps {
    trackingHistory: TrackingHistoryItem[]
}

export function OrderTrackingTimeline({
    trackingHistory,
}: OrderTrackingTimelineProps) {
    const getStatusIcon = (status: string, shippingStatus?: string) => {
        const statusToCheck = (shippingStatus || status).toLowerCase()
        switch (statusToCheck) {
            case 'delivered':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'out_for_delivery':
                return <Truck className="h-5 w-5 text-blue-500" />
            case 'in_transit':
                return <Truck className="h-5 w-5 text-orange-500" />
            case 'shipped':
                return <Package className="h-5 w-5 text-purple-500" />
            case 'preparing':
            case 'processing':
                return <PlayCircle className="h-5 w-5 text-yellow-500" />
            case 'delivery_failed':
            case 'failed_delivery':
                return <AlertCircle className="h-5 w-5 text-red-500" />
            default:
                return <Clock className="h-5 w-5 text-gray-500" />
        }
    }

    const getStatusText = (status: string, shippingStatus?: string) => {
        if (shippingStatus) {
            return getShippingStatusLabel(shippingStatus)
        }
        return getOrderStatusLabel(status)
    }

    if (!trackingHistory || trackingHistory.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Lịch sử theo dõi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            Chưa có thông tin theo dõi
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Lịch sử theo dõi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {trackingHistory.map((item, index) => {
                        const isLast = index === trackingHistory.length - 1
                        return (
                            <div key={item.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="rounded-full bg-background border-2 border-border p-2">
                                        {getStatusIcon(
                                            item.status,
                                            item.shippingStatus
                                        )}
                                    </div>
                                    {!isLast && (
                                        <div className="w-px h-16 bg-border mt-2" />
                                    )}
                                </div>
                                <div className="flex-1 pb-8">
                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            {getStatusText(
                                                item.status,
                                                item.shippingStatus
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.message}
                                        </p>
                                        {item.location && (
                                            <p className="text-sm text-muted-foreground">
                                                📍 {item.location}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {formatDateTime(item.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
