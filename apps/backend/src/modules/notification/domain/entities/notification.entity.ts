export interface Notification {
    id: string
    userId: string
    type: NotificationType
    title: string
    message: string
    data?: NotificationData
    isRead: boolean
    priority: NotificationPriority
    channels: NotificationChannel[]
    scheduledAt?: Date
    sentAt?: Date
    readAt?: Date
    expiresAt?: Date
    createdAt: Date
    updatedAt: Date
}

export enum NotificationType {
    ORDER_CREATED = 'ORDER_CREATED',
    ORDER_CONFIRMED = 'ORDER_CONFIRMED',
    ORDER_SHIPPED = 'ORDER_SHIPPED',
    ORDER_DELIVERED = 'ORDER_DELIVERED',
    ORDER_CANCELLED = 'ORDER_CANCELLED',
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    PRODUCT_BACK_IN_STOCK = 'PRODUCT_BACK_IN_STOCK',
    PRICE_DROP = 'PRICE_DROP',
    NEW_PRODUCT_LAUNCH = 'NEW_PRODUCT_LAUNCH',
    PROMOTION = 'PROMOTION',
    REVIEW_REQUEST = 'REVIEW_REQUEST',
    ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
    SECURITY_ALERT = 'SECURITY_ALERT'
}

export enum NotificationPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum NotificationChannel {
    IN_APP = 'IN_APP',
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    PUSH = 'PUSH'
}

export interface NotificationData {
    orderId?: string
    productId?: string
    paymentId?: string
    amount?: number
    trackingNumber?: string
    promoCode?: string
    imageUrl?: string
    actionUrl?: string
    metadata?: Record<string, any>
}

export interface CreateNotificationData {
    userId: string
    type: NotificationType
    title: string
    message: string
    data?: NotificationData
    priority?: NotificationPriority
    channels?: NotificationChannel[]
    scheduledAt?: Date
    expiresAt?: Date
}

export interface UpdateNotificationData {
    isRead?: boolean
    readAt?: Date
}

export interface NotificationFilters {
    userId?: string
    type?: NotificationType[]
    isRead?: boolean
    priority?: NotificationPriority[]
    channels?: NotificationChannel[]
    dateFrom?: Date
    dateTo?: Date
}

export interface NotificationPagination {
    page: number
    limit: number
    sortBy?: 'createdAt' | 'priority' | 'readAt'
    sortOrder?: 'asc' | 'desc'
}

export interface NotificationPreferences {
    userId: string
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    orderUpdates: boolean
    promotions: boolean
    priceAlerts: boolean
    stockAlerts: boolean
    newProducts: boolean
    reviewRequests: boolean
    securityAlerts: boolean
} 