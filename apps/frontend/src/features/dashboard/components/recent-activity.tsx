'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RecentActivity } from '@/shared/types'
import { Activity, ShoppingCart, Users, Package } from 'lucide-react'

interface RecentActivityProps {
    activity: RecentActivity | undefined
    isLoading: boolean
}

export function RecentActivityCard({
    activity,
    isLoading,
}: RecentActivityProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Hoạt Động Gần Đây
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-start space-x-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-3 w-[100px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    const formatTime = (timestamp: string) => {
        const now = new Date()
        const time = new Date(timestamp)
        const diffMs = now.getTime() - time.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 1) return 'Vừa xong'
        if (diffMins < 60) return `${diffMins} phút trước`
        if (diffHours < 24) return `${diffHours} giờ trước`
        return `${diffDays} ngày trước`
    }

    const getActivityIcon = (type: string) => {
        if (type.includes('ORDER')) return ShoppingCart
        if (type.includes('USER')) return Users
        if (type.includes('PRODUCT')) return Package
        return Activity
    }

    // Combine all activities and sort by timestamp
    const allActivities = [
        ...(activity?.orders || []),
        ...(activity?.users || []),
        ...(activity?.products || []),
    ].sort(
        (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Hoạt Động Gần Đây
                </CardTitle>
            </CardHeader>
            <CardContent>
                {allActivities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Activity className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Chưa có hoạt động nào
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-[400px]">
                        <div className="space-y-4">
                            {allActivities.slice(0, 8).map((item, index) => {
                                const Icon = getActivityIcon(item.type)
                                return (
                                    <div
                                        key={`${item.type}-${item.id}-${index}`}
                                        className="flex items-start space-x-3 border-b pb-3 last:border-b-0"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>
                                                <Icon className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm">
                                                {item.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatTime(item.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}
