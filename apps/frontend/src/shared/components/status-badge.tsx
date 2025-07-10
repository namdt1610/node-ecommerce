'use client'

import { Badge } from '@/components/ui/badge'
import { 
    getOrderStatusLabel, 
    getOrderStatusColor,
    getShippingStatusLabel,
    getPaymentStatusLabel,
    SHIPPING_STATUS_COLORS,
    PAYMENT_STATUS_COLORS
} from '@/shared/utils'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

interface StatusBadgeProps {
    status: string
    type?: 'order' | 'shipping' | 'payment'
    className?: string
}

export function StatusBadge({ 
    status, 
    type = 'order', 
    className 
}: StatusBadgeProps) {
    const getLabel = () => {
        switch (type) {
            case 'shipping':
                return getShippingStatusLabel(status)
            case 'payment':
                return getPaymentStatusLabel(status)
            default:
                return getOrderStatusLabel(status)
        }
    }

    const getVariant = (): BadgeVariant => {
        let variant: string
        switch (type) {
            case 'shipping':
                variant = SHIPPING_STATUS_COLORS[status] || 
                         SHIPPING_STATUS_COLORS[status.toLowerCase()] || 
                         'secondary'
                break
            case 'payment':
                variant = PAYMENT_STATUS_COLORS[status] || 
                         PAYMENT_STATUS_COLORS[status.toLowerCase()] || 
                         'secondary'
                break
            default:
                variant = getOrderStatusColor(status)
        }
        
        // Ensure we return a valid variant
        const validVariants: BadgeVariant[] = ['default', 'secondary', 'destructive', 'outline']
        return validVariants.includes(variant as BadgeVariant) 
            ? (variant as BadgeVariant) 
            : 'secondary'
    }

    return (
        <Badge 
            variant={getVariant()} 
            className={className}
        >
            {getLabel()}
        </Badge>
    )
}
 