// Common utility functions
// Common utility functions
export const formatPrice = (price: number): string => {
    return `₫${price.toLocaleString('vi-VN')}`
}

export const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export const formatDateTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-') // Replace multiple - with single -
        .replace(/^-+|-+$/g, '') // Trim - from start and end
}

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

export const calculateDiscount = (
    originalPrice: number,
    salePrice: number
): number => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export const generateStarRating = (
    rating: number,
    maxRating: number = 5
): boolean[] => {
    return Array.from({ length: maxRating }, (_, index) => index < rating)
}

export const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay)
    }
}

export const cn = (
    ...classes: (string | undefined | null | false)[]
): string => {
    return classes.filter(Boolean).join(' ')
}

// Validation helpers
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Local storage helpers
export const storage = {
    get: <T>(key: string): T | null => {
        if (typeof window === 'undefined') return null
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        } catch {
            return null
        }
    },
    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {
            // Handle storage errors silently
        }
    },
    remove: (key: string): void => {
        if (typeof window === 'undefined') return
        localStorage.removeItem(key)
    },
    clear: (): void => {
        if (typeof window === 'undefined') return
        localStorage.clear()
    },
}
