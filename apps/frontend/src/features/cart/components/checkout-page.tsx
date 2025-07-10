'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock } from 'lucide-react'
import { Layout } from '@/shared'
import Link from 'next/link'
import { ShippingForm } from './shipping-form'
import { PaymentMethodSelector } from './payment-method-selector'
import { OrderSummary } from './order-summary'
import { useCheckout } from '../hooks/use-checkout'

export default function CheckoutPage() {
    const {
        cart,
        cartLoading,
        shippingInfo,
        paymentMethod,
        isProcessing,
        subtotal,
        shipping,
        total,
        handleInputChange,
        setPaymentMethod,
        handlePlaceOrder,
    } = useCheckout()

    if (cartLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">Đang tải giỏ hàng...</div>
                </div>
            </Layout>
        )
    }

    if (!cart?.items || cart.items.length === 0) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">
                            Giỏ hàng trống
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Thêm sản phẩm vào giỏ hàng để tiến hành thanh toán
                        </p>
                        <Link href="/products">
                            <Button>Tiếp tục mua sắm</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">
                        Trang chủ
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/cart" className="hover:text-foreground">
                        Giỏ hàng
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">Thanh toán</span>
                </div>

                {/* Back to Cart */}
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại giỏ hàng
                </Link>

                {/* Page Title */}
                <div className="flex items-center gap-2 mb-8">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold">Thanh toán đơn hàng</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Form */}
                        <ShippingForm
                            shippingInfo={shippingInfo}
                            onInputChange={handleInputChange}
                            disabled={isProcessing}
                        />

                        {/* Payment Method */}
                        <PaymentMethodSelector
                            paymentMethod={paymentMethod}
                            onPaymentMethodChange={setPaymentMethod}
                            disabled={isProcessing}
                        />
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            <OrderSummary
                                items={cart.items}
                                subtotal={subtotal}
                                shipping={shipping}
                                total={total}
                            />

                            {/* Place Order Button */}
                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                size="lg"
                                className="w-full"
                            >
                                {isProcessing ? (
                                    <>
                                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Đặt hàng ngay'
                                )}
                            </Button>

                            <p className="text-sm text-muted-foreground text-center">
                                Bằng cách đặt hàng, bạn đồng ý với{' '}
                                <Link
                                    href="/terms"
                                    className="text-blue-600 hover:underline"
                                >
                                    Điều khoản dịch vụ
                                </Link>{' '}
                                và{' '}
                                <Link
                                    href="/privacy"
                                    className="text-blue-600 hover:underline"
                                >
                                    Chính sách bảo mật
                                </Link>{' '}
                                của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
