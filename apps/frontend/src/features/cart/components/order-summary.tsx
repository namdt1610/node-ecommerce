/**
 * Order Summary Component
 * Displays cart items, totals, and shipping information
 */

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Package } from 'lucide-react'
import { CartItem } from '@/shared/types'
import { formatPrice } from '@/shared/utils'

interface OrderSummaryProps {
    items: CartItem[]
    subtotal: number
    shipping: number
    total: number
}

export function OrderSummary({
    items,
    subtotal,
    shipping,
    total,
}: OrderSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Đơn hàng của bạn
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 py-2"
                        >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={
                                        item.product?.imageUrl ||
                                        '/placeholder-product.jpg'
                                    }
                                    alt={item.product?.name || 'Product'}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                    {item.quantity}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                    {item.product?.name}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {formatPrice(item.product?.price || 0)} x{' '}
                                    {item.quantity}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">
                                    {formatPrice(
                                        (item.product?.price || 0) *
                                            item.quantity
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Phí vận chuyển:</span>
                        <span>
                            {shipping > 0 ? formatPrice(shipping) : 'Miễn phí'}
                        </span>
                    </div>
                    {subtotal > 500000 && (
                        <div className="flex justify-between text-green-600 text-sm">
                            <span>🎉 Miễn phí vận chuyển:</span>
                            <span>-{formatPrice(30000)}</span>
                        </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-blue-600">
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>

                {/* Shipping info */}
                {subtotal <= 500000 && (
                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                        💡 Mua thêm{' '}
                        <span className="font-medium">
                            {formatPrice(500000 - subtotal)}
                        </span>{' '}
                        để được miễn phí vận chuyển
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
