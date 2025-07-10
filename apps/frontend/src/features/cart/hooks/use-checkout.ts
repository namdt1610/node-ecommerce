'use client'

/**
 * Checkout Business Logic Hook
 * Handles all checkout-related state and operations
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, useCreateOrder, useClearCart } from '@/hooks'
import { useAuthProfile } from '@/features/auth/hooks/use-auth-profile'
import { useToast } from '@/shared'
import { CartItem } from '@/shared/types'

export interface ShippingInfo {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
    notes: string
}

export function useCheckout() {
    const router = useRouter()
    const { data: cart, isLoading: cartLoading } = useCart()
    const { data: profile } = useAuthProfile()
    const createOrderMutation = useCreateOrder()
    const clearCartMutation = useClearCart()
    const { success, error, warning } = useToast()

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
            warning.emptyCart()
            router.push('/cart')
        }
    }, [cart, cartLoading, router, warning])

    const handleInputChange = (field: keyof ShippingInfo, value: string) => {
        setShippingInfo((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Calculate totals
    const subtotal =
        cart?.items?.reduce(
            (sum: number, item: CartItem) =>
                sum + (item.product?.price || 0) * item.quantity,
            0
        ) || 0
    const shipping = subtotal > 500000 ? 0 : 30000
    const total = subtotal + shipping

    const validateShippingInfo = (): boolean => {
        const requiredFields = ['fullName', 'email', 'phone', 'address', 'city']
        const missingFields = requiredFields.filter(
            (field) => !shippingInfo[field as keyof ShippingInfo]
        )

        if (missingFields.length > 0) {
            error.validation('Vui lòng điền đầy đủ thông tin giao hàng!')
            return false
        }

        return true
    }

    const validateCartItems = (): CartItem[] => {
        if (!cart?.items || cart.items.length === 0) {
            error.validation('Giỏ hàng trống!')
            return []
        }

        const validItems = cart.items.filter((item: CartItem) => {
            const hasValidProductId =
                item.productId && typeof item.productId === 'string'
            const hasValidQuantity =
                item.quantity &&
                typeof item.quantity === 'number' &&
                item.quantity > 0
            const hasValidPrice =
                (item.price || item.product?.price) &&
                typeof (item.price || item.product?.price) === 'number'

            return hasValidProductId && hasValidQuantity && hasValidPrice
        })

        if (validItems.length === 0) {
            error.validation('Giỏ hàng không có sản phẩm hợp lệ!')
            return []
        }

        return validItems
    }

    const handlePlaceOrder = async () => {
        if (!validateShippingInfo()) return

        const validItems = validateCartItems()
        if (validItems.length === 0) return

        setIsProcessing(true)

        try {
            const orderData = {
                items: validItems.map((item: CartItem) => ({
                    productId: item.productId || item.product?.id || '',
                    quantity: item.quantity,
                    price: item.price || item.product?.price || 0,
                })),
                shippingAddress: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`,
                paymentMethod: paymentMethod,
            }

            const response = await createOrderMutation.mutateAsync(orderData)

            // Clear cart after successful order
            await clearCartMutation.mutateAsync()

            // Show success toast and redirect
            success.orderPlaced(response.data?.id)
            router.push('/orders')
        } catch (err: unknown) {
            console.error('Order creation failed:', err)

            // Handle different types of errors
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as {
                    response: {
                        data: {
                            errors?: Array<{ field: string; message: string }>
                            message?: string
                        }
                    }
                }
                if (axiosError.response?.data?.errors) {
                    const errors = axiosError.response.data.errors
                    const errorMessages = errors
                        .map((e) => `${e.field}: ${e.message}`)
                        .join('\n')
                    error.validation(errorMessages)
                } else if (axiosError.response?.data?.message) {
                    error.validation(axiosError.response.data.message)
                } else {
                    error.orderFailed()
                }
            } else {
                error.orderFailed()
            }
        } finally {
            setIsProcessing(false)
        }
    }

    return {
        // State
        cart,
        cartLoading,
        shippingInfo,
        paymentMethod,
        isProcessing,

        // Computed values
        subtotal,
        shipping,
        total,

        // Actions
        handleInputChange,
        setPaymentMethod,
        handlePlaceOrder,
    }
}
