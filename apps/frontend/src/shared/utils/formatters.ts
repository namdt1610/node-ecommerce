// =================================
// FORMATTERS - CENTRALIZED
// =================================
// All formatting functions in one place to avoid duplication

// =================================
// CURRENCY FORMATTING
// =================================

/**
 * Format price in Vietnamese Dong
 * @param price - Price in VND
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted price string
 */
export const formatPrice = (
    price: number,
    showSymbol: boolean = true
): string => {
    if (isNaN(price) || price < 0) return '0đ'

    const formatted = price.toLocaleString('vi-VN')
    return showSymbol ? `${formatted}đ` : formatted
}

/**
 * Format price with currency symbol prefix (alternative style)
 */
export const formatPricePrefix = (price: number): string => {
    return `₫${price.toLocaleString('vi-VN')}`
}

/**
 * Format price for international display
 */
export const formatPriceIntl = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price)
}

/**
 * Calculate and format discount percentage
 */
export const formatDiscount = (
    originalPrice: number,
    salePrice: number
): string => {
    if (originalPrice <= salePrice) return '0%'
    const discount = Math.round(
        ((originalPrice - salePrice) / originalPrice) * 100
    )
    return `${discount}%`
}

/**
 * Calculate discount amount
 */
export const calculateDiscount = (
    originalPrice: number,
    salePrice: number
): number => {
    if (originalPrice <= salePrice) return 0
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

// =================================
// DATE & TIME FORMATTING
// =================================

/**
 * Format date in Vietnamese style
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 */
export const formatDate = (
    date: string | Date,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
): string => {
    if (!date) return ''

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        if (isNaN(dateObj.getTime())) return ''

        return dateObj.toLocaleDateString('vi-VN', options)
    } catch {
        return ''
    }
}

/**
 * Format date with time
 */
export const formatDateTime = (date: string | Date): string => {
    return formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
    if (!date) return ''

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        const now = new Date()
        const diffMs = now.getTime() - dateObj.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 1) return 'Vừa xong'
        if (diffMins < 60) return `${diffMins} phút trước`
        if (diffHours < 24) return `${diffHours} giờ trước`
        if (diffDays < 7) return `${diffDays} ngày trước`

        return formatDate(dateObj, { month: 'short', day: 'numeric' })
    } catch {
        return ''
    }
}

// =================================
// TEXT FORMATTING
// =================================

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
}

/**
 * Slugify text for URLs
 */
export const slugify = (text: string): string => {
    if (!text) return ''

    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-') // Replace multiple - with single -
        .replace(/^-+|-+$/g, '') // Trim - from start and end
}

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Format phone number (Vietnamese style)
 */
export const formatPhoneNumber = (phone: string): string => {
    if (!phone) return ''

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')

    // Format based on length
    if (digits.length === 10) {
        return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
    }
    if (digits.length === 11) {
        return digits.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
    }

    return phone // Return original if doesn't match expected patterns
}

// =================================
// NUMBER FORMATTING
// =================================

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
    if (isNaN(num)) return '0'
    return num.toLocaleString('vi-VN')
}

/**
 * Format percentage
 */
export const formatPercentage = (
    value: number,
    decimals: number = 1
): string => {
    if (isNaN(value)) return '0%'
    return `${value.toFixed(decimals)}%`
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
