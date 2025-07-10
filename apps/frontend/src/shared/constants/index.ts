// Common constants used across the application
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        PROFILE: '/users/profile',
    },
    // Products
    PRODUCTS: {
        BASE: '/products',
        BY_ID: (id: string) => `/products/${id}`,
        SEARCH: '/products/search',
    },
    // Categories
    CATEGORIES: {
        BASE: '/categories',
        BY_ID: (id: string) => `/categories/${id}`,
    },
    // Cart
    CART: {
        BASE: '/cart',
        ADD: '/cart/add',
        ITEMS: (id: string) => `/cart/items/${id}`,
    },
    // Orders
    ORDERS: {
        BASE: '/orders',
        BY_ID: (id: string) => `/orders/${id}`,
        STATUS: (id: string) => `/orders/${id}/status`,
    },
} as const

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: (id: string) => `/products/${id}`,
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDERS: '/orders',
    ORDER_DETAIL: (id: string) => `/orders/${id}`,
    ORDER_TRACKING: (id: string) => `/orders/${id}/tracking`,
    ORDER_TRACKING_DEMO: '/demo/order-tracking',
    PROFILE: '/profile',
} as const

export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    CART: 'cart',
} as const

export const DEFAULT_PAGINATION = {
    PAGE: 1,
    LIMIT: 12,
} as const

export const PRODUCT_SORT_OPTIONS = [
    { value: 'name_asc', label: 'Tên A-Z' },
    { value: 'name_desc', label: 'Tên Z-A' },
    { value: 'price_asc', label: 'Giá thấp đến cao' },
    { value: 'price_desc', label: 'Giá cao đến thấp' },
    { value: 'created_desc', label: 'Mới nhất' },
    { value: 'created_asc', label: 'Cũ nhất' },
] as const

export const ORDER_STATUS_LABELS = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
} as const
