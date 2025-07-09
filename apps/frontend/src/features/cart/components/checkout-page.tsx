'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, Truck, Banknote, Wallet } from 'lucide-react'
import { useCart, useCreateOrder, useClearCart } from '@/hooks/use-api'
import { useAuthProfile } from '@/features/auth'
import { Layout } from '@/shared'
import Link from 'next/link'
import Image from 'next/image'

interface ShippingInfo {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
    notes: string
}

interface OrderItem {
    id: string
    product: {
        id: string
        name: string
        price: number
        imageUrl?: string
    }
    quantity: number
}

export default function CheckoutPage() {
    const router = useRouter()
    const { data: cart, isLoading: cartLoading } = useCart()
    const { data: profile } = useAuthProfile()
    const createOrderMutation = useCreateOrder()
    const clearCartMutation = useClearCart()

    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        notes: '',
    })

    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [isProcessing, setIsProcessing] = useState(false)

    // Pre-fill user information if logged in
    useEffect(() => {
        if (profile) {
            setShippingInfo((prev) => ({
                ...prev,
                fullName: profile.name || '',
                email: profile.email || '',
            }))
        }
    }, [profile])

    // Redirect if cart is empty
    useEffect(() => {
        if (!cartLoading && (!cart?.items || cart.items.length === 0)) {
            router.push('/cart')
        }
    }, [cart, cartLoading, router])

    const handleInputChange = (field: keyof ShippingInfo, value: string) => {
        setShippingInfo((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Calculate totals
    const subtotal =
        cart?.items?.reduce(
            (sum: number, item: OrderItem) =>
                sum + item.product.price * item.quantity,
            0
        ) || 0
    const shipping = subtotal > 500000 ? 0 : 30000
    const total = subtotal + shipping

    const handlePlaceOrder = async () => {
        if (!cart?.items || cart.items.length === 0) {
            alert('Giỏ hàng trống!')
            return
        }

        // Validate required fields
        const requiredFields = ['fullName', 'email', 'phone', 'address', 'city']
        const missingFields = requiredFields.filter(
            (field) => !shippingInfo[field as keyof ShippingInfo]
        )

        if (missingFields.length > 0) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng!')
            return
        }

        setIsProcessing(true)

        try {
            const orderData = {
                items: cart.items.map((item: OrderItem) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                shippingAddress: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`,
                paymentMethod: paymentMethod,
            }

            await createOrderMutation.mutateAsync(orderData)

            // Clear cart after successful order
            await clearCartMutation.mutateAsync()

            // Redirect to success page
            alert('Đặt hàng thành công!')
            router.push('/orders')
        } catch (error) {
            console.error('Order creation failed:', error)
            alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!')
        } finally {
            setIsProcessing(false)
        }
    }

    if (cartLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">Đang tải...</div>
                </div>
            </Layout>
        )
    }

    if (!cart?.items || cart.items.length === 0) {
        return null // Will redirect
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/cart"
                        className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại giỏ hàng
                    </Link>
                    <h1 className="text-3xl font-bold">Thanh toán</h1>
                    <p className="text-muted-foreground">
                        Hoàn tất thông tin để đặt hàng
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Truck className="h-5 w-5 mr-2" />
                                    Thông tin giao hàng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="fullName">
                                            Họ và tên *
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={shippingInfo.fullName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'fullName',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">
                                            Số điện thoại *
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={shippingInfo.phone}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'phone',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0901234567"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={shippingInfo.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address">Địa chỉ *</Label>
                                    <Input
                                        id="address"
                                        value={shippingInfo.address}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'address',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Số nhà, tên đường"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="ward">Phường/Xã</Label>
                                        <Input
                                            id="ward"
                                            value={shippingInfo.ward}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'ward',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Phường/Xã"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="district">
                                            Quận/Huyện
                                        </Label>
                                        <Input
                                            id="district"
                                            value={shippingInfo.district}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'district',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Quận/Huyện"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="city">
                                            Tỉnh/Thành phố *
                                        </Label>
                                        <Input
                                            id="city"
                                            value={shippingInfo.city}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'city',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Tỉnh/Thành phố"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="notes">Ghi chú</Label>
                                    <Textarea
                                        id="notes"
                                        value={shippingInfo.notes}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'notes',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Phương thức thanh toán
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Label
                                            htmlFor="cod"
                                            className="flex items-center cursor-pointer flex-1"
                                        >
                                            <Banknote className="h-5 w-5 mr-3" />
                                            <div>
                                                <div className="font-medium">
                                                    Thanh toán khi nhận hàng
                                                    (COD)
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Thanh toán bằng tiền mặt khi
                                                    nhận hàng
                                                </div>
                                            </div>
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                                        <RadioGroupItem
                                            value="bank"
                                            id="bank"
                                            disabled
                                        />
                                        <Label
                                            htmlFor="bank"
                                            className="flex items-center cursor-pointer flex-1"
                                        >
                                            <CreditCard className="h-5 w-5 mr-3" />
                                            <div>
                                                <div className="font-medium">
                                                    Chuyển khoản ngân hàng
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Sắp ra mắt
                                                </div>
                                            </div>
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                                        <RadioGroupItem
                                            value="momo"
                                            id="momo"
                                            disabled
                                        />
                                        <Label
                                            htmlFor="momo"
                                            className="flex items-center cursor-pointer flex-1"
                                        >
                                            <Wallet className="h-5 w-5 mr-3" />
                                            <div>
                                                <div className="font-medium">
                                                    Ví điện tử MoMo
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Sắp ra mắt
                                                </div>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Tóm tắt đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Order Items */}
                                <div className="space-y-3">
                                    {cart.items.map((item: OrderItem) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center space-x-3"
                                        >
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={
                                                        item.product.imageUrl ||
                                                        '/api/placeholder/48/48'
                                                    }
                                                    alt={item.product.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    SL: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-sm font-medium">
                                                ₫
                                                {(
                                                    item.product.price *
                                                    item.quantity
                                                ).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                {/* Pricing Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Tạm tính:</span>
                                        <span>
                                            ₫{subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
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

                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handlePlaceOrder}
                                    disabled={
                                        isProcessing ||
                                        createOrderMutation.isPending
                                    }
                                >
                                    {isProcessing ? (
                                        'Đang xử lý...'
                                    ) : (
                                        <>
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Đặt hàng
                                        </>
                                    )}
                                </Button>

                                <div className="text-xs text-muted-foreground text-center">
                                    Bằng cách đặt hàng, bạn đồng ý với{' '}
                                    <Link href="/terms" className="underline">
                                        Điều khoản dịch vụ
                                    </Link>{' '}
                                    của chúng tôi
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
