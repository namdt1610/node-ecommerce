'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowLeft,
    CreditCard,
} from 'lucide-react'
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks/use-api'
import { Layout } from '@/shared'
import Link from 'next/link'
import Image from 'next/image'
import { CartItem } from '@/shared/types'

export default function CartPage() {
    const { data: cart, isLoading } = useCart()
    const updateCartMutation = useUpdateCartItem()
    const removeCartMutation = useRemoveFromCart()

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) {
            removeCartMutation.mutate(itemId)
        } else {
            updateCartMutation.mutate({ itemId, quantity })
        }
    }

    const removeItem = (itemId: string) => {
        removeCartMutation.mutate(itemId)
    }

    // Calculate totals
    const subtotal =
        cart?.items?.reduce(
            (sum: number, item: CartItem) =>
                sum + (item.product?.price || 0) * item.quantity,
            0
        ) || 0
    const shipping = subtotal > 500000 ? 0 : 30000 // Free shipping over 500k
    const total = subtotal + shipping

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-20 h-20 bg-gray-200 animate-pulse rounded" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                                                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tóm tắt đơn hàng</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 animate-pulse rounded" />
                                        <div className="h-4 bg-gray-200 animate-pulse rounded" />
                                        <div className="h-6 bg-gray-200 animate-pulse rounded" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!cart?.items || cart.items.length === 0) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-16 text-center">
                    <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
                    <h1 className="text-2xl font-bold mb-4">
                        Giỏ hàng của bạn đang trống
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        Hãy khám phá các sản phẩm tuyệt vời của chúng tôi
                    </p>
                    <Link href="/products">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Tiếp tục mua sắm
                        </Button>
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Giỏ hàng của bạn
                    </h1>
                    <p className="text-muted-foreground">
                        Bạn có {cart.items.length} sản phẩm trong giỏ hàng
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item: CartItem) => {
                            if (!item.product) return null
                            return (
                                <Card key={item.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src="/api/placeholder/80/80"
                                                    alt={item.product.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/products/${item.product.id}`}
                                                >
                                                    <h3 className="font-semibold hover:text-primary cursor-pointer">
                                                        {item.product.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        item.product.category
                                                            ?.name
                                                    }
                                                </p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <span className="font-bold text-red-600">
                                                        ₫
                                                        {item.product.price.toLocaleString()}
                                                    </span>
                                                    {item.product
                                                        .originalPrice && (
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            ₫
                                                            {item.product.originalPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        updateCartMutation.isPending
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const quantity =
                                                            parseInt(
                                                                e.target.value
                                                            ) || 0
                                                        updateQuantity(
                                                            item.id,
                                                            quantity
                                                        )
                                                    }}
                                                    className="w-16 text-center"
                                                    min="0"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        updateCartMutation.isPending
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right">
                                                <div className="font-bold">
                                                    ₫
                                                    {(
                                                        item.product.price *
                                                        item.quantity
                                                    ).toLocaleString()}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    disabled={
                                                        removeCartMutation.isPending
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tóm tắt đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Tạm tính:</span>
                                        <span>
                                            ₫{subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển:</span>
                                        <span>
                                            {shipping === 0 ? (
                                                <Badge variant="secondary">
                                                    Miễn phí
                                                </Badge>
                                            ) : (
                                                `₫${shipping.toLocaleString()}`
                                            )}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-red-600">
                                            ₫{total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {shipping > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-sm text-blue-600">
                                            Mua thêm ₫
                                            {(
                                                500000 - subtotal
                                            ).toLocaleString()}{' '}
                                            để được miễn phí vận chuyển
                                        </p>
                                    </div>
                                )}

                                <Link href="/checkout">
                                    <Button className="w-full" size="lg">
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Thanh toán
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Continue Shopping */}
                        <Card>
                            <CardContent className="p-6 text-center">
                                <h4 className="font-semibold mb-2">
                                    Tiếp tục mua sắm
                                </h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Khám phá thêm nhiều sản phẩm tuyệt vời
                                </p>
                                <Link href="/products">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Xem thêm sản phẩm
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Promotion */}
                        <Card>
                            <CardContent className="p-6">
                                <h4 className="font-semibold mb-3">
                                    Mã giảm giá
                                </h4>
                                <div className="flex space-x-2">
                                    <Input placeholder="Nhập mã giảm giá" />
                                    <Button variant="outline">Áp dụng</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
