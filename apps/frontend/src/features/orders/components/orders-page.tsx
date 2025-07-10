'use client'

import { useOrders } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Package, MapPin } from 'lucide-react'
import { Layout, StatusBadge } from '@/shared'
import { Order } from '@/shared/types'
import { formatPrice, formatDate } from '@/shared/utils'
import Link from 'next/link'

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

    // Ensure orders is an array
    const ordersArray = Array.isArray(orders) ? orders : []

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <Breadcrumb
                    className="mb-6"
                    items={[{ label: 'Đơn hàng của bạn', current: true }]}
                />

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Đơn hàng của bạn</h1>
                    <p className="text-muted-foreground">
                        Theo dõi tình trạng và lịch sử đơn hàng
                    </p>
                </div>

                {/* Orders List */}
                {!ordersArray || ordersArray.length === 0 ? (
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
                        {ordersArray.map((order: Order) => (
                            <Card key={order.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">
                                            Đơn hàng #{order.id.slice(-8)}
                                        </CardTitle>
                                        <StatusBadge
                                            status={order.status}
                                            type="order"
                                        />
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Đặt hàng ngày:{' '}
                                        {formatDate(order.createdAt)}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Order Items */}
                                    <div className="space-y-2">
                                        {order.items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between py-2"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {item.product?.name ||
                                                            'Sản phẩm'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Số lượng:{' '}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {formatPrice(
                                                            item.price *
                                                                item.quantity
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatPrice(
                                                            item.price
                                                        )}{' '}
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
                                            {formatPrice(order.total)}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-4">
                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="outline" size="sm">
                                                Xem chi tiết
                                            </Button>
                                        </Link>
                                        <Link
                                            href={`/orders/${order.id}/tracking`}
                                        >
                                            <Button size="sm">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                Theo dõi
                                            </Button>
                                        </Link>
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
