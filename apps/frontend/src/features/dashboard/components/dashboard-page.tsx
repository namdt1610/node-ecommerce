'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    useDashboardStats,
    useSalesAnalytics,
    useRecentActivity,
    useRefreshDashboard,
} from '@/hooks'
import { useSocket } from '../hooks/use-socket'
import { StatsCards } from './stats-cards'
import { RecentOrders } from './recent-orders'
import { TopProducts } from './top-products'
import { RecentActivityCard } from './recent-activity'
import {
    BarChart3,
    RefreshCw,
    Wifi,
    WifiOff,
    Calendar,
    AlertCircle,
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function DashboardPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<number>(30)

    // API hooks
    const { data: stats, isLoading: statsLoading } = useDashboardStats()
    const { data: salesData, isLoading: salesLoading } =
        useSalesAnalytics(selectedPeriod)
    const { data: activity, isLoading: activityLoading } = useRecentActivity()
    const refreshMutation = useRefreshDashboard()

    // Socket connection
    const { isConnected, connectionError } = useSocket(true)

    const handleRefresh = () => {
        refreshMutation.mutate()
    }

    const periodOptions = [
        { value: 7, label: '7 ngày qua' },
        { value: 30, label: '30 ngày qua' },
        { value: 90, label: '90 ngày qua' },
    ]

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <BarChart3 className="h-8 w-8" />
                        Admin Dashboard
                    </h2>
                    <p className="text-muted-foreground">
                        Tổng quan hệ thống ecommerce
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <Badge variant={isConnected ? 'default' : 'destructive'}>
                        {isConnected ? (
                            <>
                                <Wifi className="w-3 h-3 mr-1" />
                                Real-time
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-3 h-3 mr-1" />
                                Offline
                            </>
                        )}
                    </Badge>

                    <Select
                        value={selectedPeriod.toString()}
                        onValueChange={(value) =>
                            setSelectedPeriod(parseInt(value))
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {periodOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value.toString()}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleRefresh}
                        disabled={refreshMutation.isPending}
                        size="sm"
                        variant="outline"
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`}
                        />
                    </Button>
                </div>
            </div>

            {connectionError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Lỗi kết nối real-time: {connectionError}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <StatsCards stats={stats} isLoading={statsLoading} />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4 space-y-4">
                        <RecentOrders
                            salesData={salesData}
                            isLoading={salesLoading}
                        />
                    </div>
                    <div className="col-span-3 space-y-4">
                        <TopProducts
                            salesData={salesData}
                            isLoading={salesLoading}
                        />
                        <RecentActivityCard
                            activity={activity}
                            isLoading={activityLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
