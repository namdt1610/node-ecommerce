'use client'

import { useParams } from 'next/navigation'
import { useOrderTracking } from '@/features/orders/hooks/use-order-tracking'
import { Layout, StatusBadge } from '@/shared'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Play, Wifi, WifiOff, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { OrderTrackingTimeline } from './order-tracking-timeline'
import { formatPrice, formatDate } from '@/shared/utils'

export default function OrderTrackingPage() {
    const params = useParams()
    const orderId = params.id as string

    const {
        order,
        trackingHistory,
        isLoading,
        error,
        isConnected,
        socketError,
        startTracking,
    } = useOrderTracking(orderId)

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">
                            Đang tải thông tin theo dõi...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (error || !order) {
        let errorMessage = 'Không thể tải thông tin đơn hàng'
        let errorDetails = ''

        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as {
                response: { status: number; data?: { message?: string } }
            }
            switch (axiosError.response?.status) {
                case 401:
                    errorMessage = 'Bạn cần đăng nhập để xem đơn hàng này'
                    errorDetails = 'Vui lòng đăng nhập và thử lại'
                    break
                case 403:
                    errorMessage = 'Bạn không có quyền xem đơn hàng này'
                    errorDetails =
                        'Đơn hàng này không thuộc về tài khoản của bạn'
                    break
                case 404:
                    errorMessage = 'Không tìm thấy đơn hàng'
                    errorDetails =
                        'Đơn hàng có thể đã bị xóa hoặc ID không chính xác'
                    break
                default:
                    errorMessage = 'Lỗi khi tải thông tin đơn hàng'
                    errorDetails =
                        axiosError.response?.data?.message ||
                        'Vui lòng thử lại sau'
            }
        }

        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center max-w-md mx-auto">
                        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-destructive mb-2">
                            {errorMessage}
                        </h2>
                        {errorDetails && (
                            <p className="text-muted-foreground mb-6">
                                {errorDetails}
                            </p>
                        )}
                        <div className="space-y-2">
                        <Link href="/orders">
                                <Button className="w-full">
                                    Quay lại danh sách đơn hàng
                                </Button>
                            </Link>
                            {error &&
                                typeof error === 'object' &&
                                'response' in error &&
                                (error as { response: { status: number } })
                                    .response?.status === 401 ? (
                                    <Link href="/login">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Đăng nhập
                                        </Button>
                        </Link>
                                ) : null}
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Breadcrumb */}
                <Breadcrumb
                    className="mb-6"
                    items={[
                        { label: 'Đơn hàng', href: '/orders' },
                        {
                            label:
                                order?.orderNumber || `#${orderId.slice(-8)}`,
                            href: `/orders/${orderId}`,
                        },
                        { label: 'Theo dõi', current: true },
                    ]}
                />

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Theo dõi đơn hàng
                            </h1>
                            <p className="text-muted-foreground">
                                #{order.orderNumber || orderId.slice(-8)}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm">
                                {isConnected ? (
                                    <>
                                        <Wifi className="h-4 w-4 text-green-500" />
                                        <span className="text-green-500">
                                            Kết nối real-time
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="h-4 w-4 text-red-500" />
                                        <span className="text-red-500">
                                            {socketError
                                                ? 'Lỗi kết nối'
                                                : 'Chưa kết nối'}
                                        </span>
                                    </>
                                )}
                            </div>

                            <StatusBadge status={order.status} type="order" />
                        </div>
                    </div>

                    {/* Socket Error Alert */}
                    {socketError && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-800">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">
                                    Kết nối real-time gặp sự cố: {socketError}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tracking Timeline */}
                    <div className="lg:col-span-2">
                        <OrderTrackingTimeline
                            trackingHistory={trackingHistory}
                        />
                    </div>

                    {/* Order Info & Actions */}
                    <div className="space-y-4">
                        <Button
                            onClick={startTracking}
                            className="w-full"
                            disabled={isLoading}
                            variant="outline"
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Cập nhật real-time
                        </Button>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">
                                Thông tin đơn hàng
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Mã đơn hàng:</span>
                                    <span className="font-mono">
                                        #
                                        {order.orderNumber || orderId.slice(-8)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ngày tạo:</span>
                                    <span>
                                        {order.createdAt
                                            ? formatDate(order.createdAt)
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tổng tiền:</span>
                                    <span className="font-semibold">
                                        {formatPrice(order.total || 0)}
                                    </span>
                                </div>
                                {order.trackingNumber && (
                                    <div className="flex justify-between">
                                        <span>Mã vận đơn:</span>
                                        <span className="font-mono">
                                            {order.trackingNumber}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
