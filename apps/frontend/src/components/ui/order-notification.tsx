'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Package, X, CheckCircle, Truck, MapPin } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface OrderNotification {
    id: string
    orderId: string
    message: string
    type: 'info' | 'success' | 'warning'
    timestamp: Date
}

interface OrderNotificationProps {
    notifications: OrderNotification[]
    onDismiss: (id: string) => void
}

export function OrderNotificationContainer({
    notifications,
    onDismiss,
}: OrderNotificationProps) {
    if (notifications.length === 0) return null

    return (
        <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
            {notifications.map((notification) => (
                <OrderNotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={onDismiss}
                />
            ))}
        </div>
    )
}

function OrderNotificationItem({
    notification,
    onDismiss,
}: {
    notification: OrderNotification
    onDismiss: (id: string) => void
}) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => onDismiss(notification.id), 300)
        }, 5000)

        return () => clearTimeout(timer)
    }, [notification.id, onDismiss])

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'warning':
                return <Truck className="h-4 w-4 text-orange-500" />
            default:
                return <Package className="h-4 w-4 text-blue-500" />
        }
    }

    const getBorderColor = () => {
        switch (notification.type) {
            case 'success':
                return 'border-green-200'
            case 'warning':
                return 'border-orange-200'
            default:
                return 'border-blue-200'
        }
    }

    return (
        <div
            className={cn(
                'transform transition-all duration-300 ease-in-out',
                isVisible
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0'
            )}
        >
            <Alert
                className={cn(
                    'bg-background/95 backdrop-blur border shadow-lg',
                    getBorderColor()
                )}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                        {getIcon()}
                        <div className="flex-1">
                            <AlertDescription className="text-sm">
                                <div className="font-medium mb-1">
                                    Đơn hàng #{notification.orderId.slice(-6)}
                                </div>
                                <div>{notification.message}</div>
                                <Link
                                    href={`/orders/${notification.orderId}/tracking`}
                                    className="text-blue-600 hover:text-blue-700 text-xs mt-1 inline-flex items-center"
                                >
                                    <MapPin className="h-3 w-3 mr-1" />
                                    Xem chi tiết
                                </Link>
                            </AlertDescription>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-transparent"
                        onClick={() => {
                            setIsVisible(false)
                            setTimeout(() => onDismiss(notification.id), 300)
                        }}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </Alert>
        </div>
    )
}
