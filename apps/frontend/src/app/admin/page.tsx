'use client'

import { useAuth, useAdmin } from '@/features/auth'
import { Layout } from '@/shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, AlertTriangle, Loader2, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminDashboard } from '@/hooks/use-admin'
import { StatsCards } from '@/components/admin/stats-cards'
import { SalesChart } from '@/components/admin/sales-chart'
import { RecentOrders } from '@/components/admin/recent-orders'
import { TopProducts } from '@/components/admin/top-products'

export default function AdminDashboard() {
    const { isAuthenticated, isLoading } = useAuth()
    const { userRole, canAccessDashboard } = useAdmin()
    const router = useRouter()

    const {
        stats,
        salesAnalytics,
        isLoading: isDashboardLoading,
        isError,
        error,
        refetch,
    } = useAdminDashboard()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                        <p className="mt-4 text-gray-600">Đang tải...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Unauthorized Access
                                </h2>
                                <p className="text-gray-600">
                                    Bạn cần đăng nhập để truy cập trang này.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        )
    }

    if (!canAccessDashboard) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <Shield className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Admin Access Required
                                </h2>
                                <p className="text-gray-600">
                                    Bạn không có quyền truy cập vào trang admin.
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Role hiện tại: {userRole || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Chỉ có admin mới được truy cập dashboard
                                    này.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        )
    }

    if (isDashboardLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                        <p className="mt-4 text-gray-600">
                            Đang tải dữ liệu dashboard...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (isError) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Lỗi Tải Dữ Liệu
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Không thể tải dữ liệu dashboard. Vui lòng
                                    thử lại.
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
            </Layout>
        )
    }

    // Render the dashboard for authenticated admin users
    return (
        <Layout>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Tổng quan về hoạt động kinh doanh
                        </p>
                    </div>
                    <Button onClick={() => refetch()} variant="outline">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Làm mới
                    </Button>
                </div>

                {/* Stats Cards */}
                {stats && <StatsCards stats={stats} />}

                {/* Charts and Analytics */}
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Sales Chart */}
                    {salesAnalytics?.revenueData && (
                        <div className="lg:col-span-4">
                            <SalesChart data={salesAnalytics.revenueData} />
                        </div>
                    )}

                    {/* Recent Orders */}
                    {salesAnalytics?.recentOrders && (
                        <div className="lg:col-span-3">
                            <RecentOrders
                                orders={salesAnalytics.recentOrders}
                            />
                        </div>
                    )}
                </div>

                {/* Top Products */}
                {salesAnalytics?.topProducts && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <TopProducts products={salesAnalytics.topProducts} />

                        {/* Additional Analytics Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Thống Kê Nâng Cao
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Các tính năng phân tích nâng cao sẽ được
                                        bổ sung
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {salesAnalytics && (
                                            <>
                                                <div>
                                                    <div className="font-medium text-2xl">
                                                        {new Intl.NumberFormat(
                                                            'vi-VN',
                                                            {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                                notation:
                                                                    'compact',
                                                            }
                                                        ).format(
                                                            salesAnalytics.averageOrderValue
                                                        )}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        Giá trị TB/đơn
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-2xl">
                                                        {salesAnalytics.conversionRate.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        Tỷ lệ chuyển đổi
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </Layout>
    )
}
