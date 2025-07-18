'use client'

import { AdminSidebar } from './admin-sidebar'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { StatsCards } from './stats-cards'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAdminDashboard } from '@/hooks/use-admin'
import { Loader2, AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function DashboardPage() {
    const { stats, salesAnalytics, isLoading, isError, error, refetch } =
        useAdminDashboard()

    if (isLoading) {
        return (
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': 'calc(var(--spacing) * 72)',
                        '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                }
            >
                <AdminSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                            <p className="mt-4 text-gray-600">
                                Đang tải dữ liệu dashboard...
                            </p>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    if (isError) {
        return (
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': 'calc(var(--spacing) * 72)',
                        '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                }
            >
                <AdminSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <Card className="w-full max-w-md">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        Lỗi Tải Dữ Liệu
                                    </h2>
                                    <p className="text-gray-600 mb-4">
                                        Không thể tải dữ liệu dashboard. Vui
                                        lòng thử lại.
                                    </p>
                                    <p className="text-sm text-red-500 mb-4">
                                        {error?.message || 'Unknown error'}
                                    </p>
                                    <Button
                                        onClick={() => refetch()}
                                        className="w-full"
                                    >
                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                        Thử Lại
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    // Transform API stats to match StatsCards interface
    const transformedStats = stats
        ? {
              ...stats,
              pendingOrders: stats.orderStats?.pending || 0,
              completedOrders: stats.orderStats?.delivered || 0,
              cancelledOrders: stats.orderStats?.cancelled || 0,
          }
        : undefined

    // Mock data structure to match existing component interface until we update components
    const mockTableData =
        salesAnalytics?.recentOrders?.map((order: any, index: number) => ({
            header: `Order #${order.id}`,
            id: index + 1,
            target: order.user?.name || 'Customer',
            type: 'Order',
            status: order.status,
            limit: `$${order.total}`,
            reviewer: 'System',
        })) || []

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AdminSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {/* Real stats data */}
                            <StatsCards
                                stats={transformedStats}
                                isLoading={isLoading}
                            />
                            <div className="px-4 lg:px-6">
                                {/* Chart component - will need to be updated to accept data */}
                                <ChartAreaInteractive />
                            </div>
                            {/* Table with transformed data */}
                            <DataTable data={mockTableData} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
