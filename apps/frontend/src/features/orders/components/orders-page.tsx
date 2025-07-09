'use client'

import { useOrders } from '@/hooks/use-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ArrowLeft,
} from 'lucide-react'
import { Layout } from '@/shared'
import Link from 'next/link'

interface Order {
    id: string
    status: string
    total: number
    orderItems: Array<{
        id: string
        quantity: number
        price: number
        product: {
            id: string
            name: string
        }
    }>
    createdAt: string
    updatedAt: string
}

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return <Clock className="h-4 w-4" />
        case 'processing':
            return <Package className="h-4 w-4" />
        case 'shipped':
            return <Truck className="h-4 w-4" />
        case 'delivered':
            return <CheckCircle className="h-4 w-4" />
        case 'cancelled':
            return <XCircle className="h-4 w-4" />
        default:
            return <Clock className="h-4 w-4" />
    }
}

const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'Chờ xử lý'
        case 'processing':
            return 'Đang xử lý'
        case 'shipped':
            return 'Đã giao vận'
        case 'delivered':
            return 'Đã giao'
        case 'cancelled':
            return 'Đã hủy'
        default:
            return status
    }
}

export default function OrdersPage() {
    const { data: orders, isLoading, error } = useOrders()

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">Đang tải đơn hàng...</div>
                </div>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-red-600">
                        Có lỗi xảy ra khi tải đơn hàng
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Về trang chủ
                    </Link>
                    <h1 className="text-3xl font-bold">Đơn hàng của bạn</h1>
                    <p className="text-muted-foreground">
                        Theo dõi tình trạng và lịch sử đơn hàng
                    </p>
                </div>

                {/* Orders List */}
                {!orders || orders.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">
                                Chưa có đơn hàng nào
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Hãy khám phá các sản phẩm và đặt đơn hàng đầu
                                tiên của bạn
                            </p>
                            <Link href="/products">
                                <Button>Mua sắm ngay</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: Order) => (
                            <Card key={order.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">
                                            Đơn hàng #{order.id.slice(-8)}
                                        </CardTitle>
                                        <Badge
                                            variant="secondary"
                                            className={`flex items-center gap-1`}
                                        >
                                            {getStatusIcon(order.status)}
                                            {getStatusText(order.status)}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Đặt hàng ngày:{' '}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString('vi-VN')}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Order Items */}
                                    <div className="space-y-2">
                                        {order.orderItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between py-2"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Số lượng:{' '}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        ₫
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        ₫
                                                        {item.price.toLocaleString()}{' '}
                                                        x {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Order Total */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg font-semibold">
                                            Tổng cộng:
                                        </div>
                                        <div className="text-lg font-bold text-red-600">
                                            ₫{order.total.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-4">
                                        <Button variant="outline" size="sm">
                                            Xem chi tiết
                                        </Button>
                                        {order.status.toLowerCase() ===
                                            'pending' && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Hủy đơn hàng
                                            </Button>
                                        )}
                                        {order.status.toLowerCase() ===
                                            'delivered' && (
                                            <Button variant="outline" size="sm">
                                                Mua lại
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}
