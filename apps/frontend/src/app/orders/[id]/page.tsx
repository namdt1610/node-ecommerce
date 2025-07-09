'use client'

import { useParams, useRouter } from 'next/navigation'
import { useOrder } from '@/hooks/use-api'
import { Layout } from '@/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Package, CreditCard, Calendar, Hash } from 'lucide-react'
import Link from 'next/link'
import { OrderItem } from '@/shared/types'

export default function OrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const orderId = params.id as string

    const { data: order, isLoading, error } = useOrder(orderId)

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'secondary'
            case 'processing':
                return 'default'
            case 'shipped':
                return 'default'
            case 'delivered':
                return 'default'
            case 'cancelled':
                return 'destructive'
            default:
                return 'secondary'
        }
    }

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'Đang chờ xử lý'
            case 'processing':
                return 'Đang xử lý'
            case 'shipped':
                return 'Đã vận chuyển'
            case 'delivered':
                return 'Đã giao hàng'
            case 'cancelled':
                return 'Đã hủy'
            default:
                return status
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price)
    }

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">
                            Đang tải chi tiết đơn hàng...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (error || !order) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-destructive mb-4">
                            Không tìm thấy đơn hàng
                        </h2>
                        <Button onClick={() => router.back()}>Quay lại</Button>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/orders"
                        className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Về danh sách đơn hàng
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Đơn hàng #{order.id.slice(-8)}
                            </h1>
                            <p className="text-muted-foreground">
                                Đặt hàng ngày{' '}
                                {new Date(order.createdAt).toLocaleDateString(
                                    'vi-VN'
                                )}
                            </p>
                        </div>
                        <Badge
                            variant={getStatusColor(order.status)}
                            className="text-sm"
                        >
                            {getStatusText(order.status)}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Sản phẩm đã đặt
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.orderItems?.map(
                                        (item: OrderItem) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between py-4 border-b last:border-b-0"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-medium">
                                                        {item.product?.name ||
                                                            'Sản phẩm'}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Số lượng:{' '}
                                                        {item.quantity}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Đơn giá:{' '}
                                                        {formatPrice(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {formatPrice(
                                                            item.price *
                                                                item.quantity
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}

                                    <Separator />

                                    <div className="flex justify-between items-center pt-4">
                                        <span className="text-lg font-semibold">
                                            Tổng cộng:
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-6">
                        {/* Order Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Hash className="h-5 w-5" />
                                    Thông tin đơn hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Ngày đặt</p>
                                        <p className="text-muted-foreground">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">
                                            Trạng thái
                                        </p>
                                        <Badge
                                            variant={getStatusColor(
                                                order.status
                                            )}
                                            className="mt-1"
                                        >
                                            {getStatusText(order.status)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Tổng tiền</p>
                                        <p className="text-muted-foreground">
                                            {formatPrice(order.total)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thao tác</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {order.status.toLowerCase() === 'pending' && (
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Hủy đơn hàng
                                    </Button>
                                )}
                                {order.status.toLowerCase() === 'delivered' && (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Mua lại
                                    </Button>
                                )}
                                <Button variant="outline" className="w-full">
                                    Liên hệ hỗ trợ
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
