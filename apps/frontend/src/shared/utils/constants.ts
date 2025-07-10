// =================================
// CONSTANTS - CENTRALIZED
// =================================
// All constants and mappings in one place for consistency

import { OrderStatus, ShippingStatus, PaymentStatus } from '../types'

// =================================
// ORDER STATUS MAPPINGS
// =================================

export const ORDER_STATUS_LABELS: Record<string, string> = {
    [OrderStatus.PENDING]: 'Chờ xử lý',
    [OrderStatus.CONFIRMED]: 'Đã xác nhận',
    [OrderStatus.PROCESSING]: 'Đang xử lý',
    [OrderStatus.SHIPPED]: 'Đã gửi hàng',
    [OrderStatus.DELIVERED]: 'Đã giao hàng',
    [OrderStatus.CANCELLED]: 'Đã hủy',
    [OrderStatus.RETURNED]: 'Đã trả hàng',
    [OrderStatus.REFUNDED]: 'Đã hoàn tiền',

    // Fallback for string values
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đã gửi hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
    returned: 'Đã trả hàng',
    refunded: 'Đã hoàn tiền',
}

export const SHIPPING_STATUS_LABELS: Record<string, string> = {
    [ShippingStatus.PENDING]: 'Chờ xử lý',
    [ShippingStatus.PROCESSING]: 'Đang xử lý',
    [ShippingStatus.SHIPPED]: 'Đã gửi hàng',
    [ShippingStatus.IN_TRANSIT]: 'Đang vận chuyển',
    [ShippingStatus.OUT_FOR_DELIVERY]: 'Đang giao hàng',
    [ShippingStatus.DELIVERED]: 'Đã giao hàng',
    [ShippingStatus.FAILED_DELIVERY]: 'Giao hàng thất bại',
    [ShippingStatus.RETURNED]: 'Đã trả hàng',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
    [PaymentStatus.PENDING]: 'Chờ thanh toán',
    [PaymentStatus.PROCESSING]: 'Đang xử lý',
    [PaymentStatus.COMPLETED]: 'Đã thanh toán',
    [PaymentStatus.FAILED]: 'Thanh toán thất bại',
    [PaymentStatus.CANCELLED]: 'Đã hủy',
    [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
}

// =================================
// STATUS COLORS (for Badges/UI)
// =================================

export const ORDER_STATUS_COLORS: Record<string, string> = {
    [OrderStatus.PENDING]: 'secondary',
    [OrderStatus.CONFIRMED]: 'default',
    [OrderStatus.PROCESSING]: 'default',
    [OrderStatus.SHIPPED]: 'default',
    [OrderStatus.DELIVERED]: 'default',
    [OrderStatus.CANCELLED]: 'destructive',
    [OrderStatus.RETURNED]: 'secondary',
    [OrderStatus.REFUNDED]: 'secondary',

    // Fallback for string values
    pending: 'secondary',
    confirmed: 'default',
    processing: 'default',
    shipped: 'default',
    delivered: 'default',
    cancelled: 'destructive',
    returned: 'secondary',
    refunded: 'secondary',
}

export const SHIPPING_STATUS_COLORS: Record<string, string> = {
    [ShippingStatus.PENDING]: 'secondary',
    [ShippingStatus.PROCESSING]: 'default',
    [ShippingStatus.SHIPPED]: 'default',
    [ShippingStatus.IN_TRANSIT]: 'default',
    [ShippingStatus.OUT_FOR_DELIVERY]: 'default',
    [ShippingStatus.DELIVERED]: 'default',
    [ShippingStatus.FAILED_DELIVERY]: 'destructive',
    [ShippingStatus.RETURNED]: 'secondary',
}

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
    [PaymentStatus.PENDING]: 'secondary',
    [PaymentStatus.PROCESSING]: 'default',
    [PaymentStatus.COMPLETED]: 'default',
    [PaymentStatus.FAILED]: 'destructive',
    [PaymentStatus.CANCELLED]: 'destructive',
    [PaymentStatus.REFUNDED]: 'secondary',
}

// =================================
// VARIANT COLOR MAPPINGS
// =================================

export const PRODUCT_COLOR_MAP: Record<string, string> = {
    'Space Gray': 'Xám',
    Silver: 'Bạc',
    Gold: 'Vàng',
    'Rose Gold': 'Vàng Hồng',
    Black: 'Đen',
    White: 'Trắng',
    Red: 'Đỏ',
    Blue: 'Xanh Dương',
    Green: 'Xanh Lá',
    Purple: 'Tím',
    Pink: 'Hồng',
    Yellow: 'Vàng',
    Midnight: 'Đen Đậm',
    Starlight: 'Ánh Sao',
    'Pacific Blue': 'Xanh Thái Bình Dương',
    Graphite: 'Than Chì',
    'Sierra Blue': 'Xanh Sierra',
    'Alpine Green': 'Xanh Alpine',
    'Deep Purple': 'Tím Đậm',
    'Natural Titanium': 'Titan Tự Nhiên',
    'Blue Titanium': 'Titan Xanh',
    'White Titanium': 'Titan Trắng',
    'Black Titanium': 'Titan Đen',
}

// =================================
// BUSINESS RULES
// =================================

export const BUSINESS_RULES = {
    // Shipping
    FREE_SHIPPING_THRESHOLD: 500000, // 500k VND
    STANDARD_SHIPPING_FEE: 30000, // 30k VND

    // Pagination
    DEFAULT_PAGE_SIZE: 12,
    DEFAULT_ORDER_PAGE_SIZE: 10,

    // Validation
    MIN_PASSWORD_LENGTH: 6,
    MAX_PRODUCT_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,

    // Currency
    CURRENCY_CODE: 'VND',
    CURRENCY_SYMBOL: '₫',

    // Files
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
}

// =================================
// API TIMEOUTS & LIMITS
// =================================

export const API_CONFIG = {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second

    // Socket.IO
    SOCKET_TIMEOUT: 10000,
    SOCKET_RECONNECT_ATTEMPTS: 5,
    SOCKET_RECONNECT_DELAY: 2000,
}

// =================================
// UI CONSTANTS
// =================================

export const UI_CONSTANTS = {
    // Debounce delays
    SEARCH_DEBOUNCE_MS: 300,
    FILTER_DEBOUNCE_MS: 500,

    // Animation durations
    TOAST_DURATION: 4000,
    LOADING_MIN_DURATION: 500,

    // Responsive breakpoints (match Tailwind)
    BREAKPOINTS: {
        SM: 640,
        MD: 768,
        LG: 1024,
        XL: 1280,
        '2XL': 1536,
    },
}

// =================================
// REGEX PATTERNS
// =================================

export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_VN: /^[0-9]{10,11}$/,
    PASSWORD_STRONG:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    ORDER_NUMBER: /^ORD-\d{6,}$/,
}

// =================================
// HELPER FUNCTIONS FOR CONSTANTS
// =================================

/**
 * Get status label with fallback
 */
export const getOrderStatusLabel = (status: string): string => {
    return (
        ORDER_STATUS_LABELS[status] ||
        ORDER_STATUS_LABELS[status.toLowerCase()] ||
        status
    )
}

/**
 * Get status color with fallback
 */
export const getOrderStatusColor = (status: string): string => {
    return (
        ORDER_STATUS_COLORS[status] ||
        ORDER_STATUS_COLORS[status.toLowerCase()] ||
        'secondary'
    )
}

/**
 * Get shipping status label with fallback
 */
export const getShippingStatusLabel = (status: string): string => {
    return SHIPPING_STATUS_LABELS[status] || status
}

/**
 * Get payment status label with fallback
 */
export const getPaymentStatusLabel = (status: string): string => {
    return PAYMENT_STATUS_LABELS[status] || status
}

/**
 * Get product color display name
 */
export const getProductColorDisplayName = (color: string): string => {
    return PRODUCT_COLOR_MAP[color] || color
}
