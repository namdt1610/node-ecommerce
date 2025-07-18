/**
 * Common formatting utilities
 */
export class FormatUtils {
    /**
     * Format currency (VND)
     */
    static formatCurrency(amount: number): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)
    }

    /**
     * Format number with thousand separators
     */
    static formatNumber(num: number): string {
        return new Intl.NumberFormat('vi-VN').format(num)
    }

    /**
     * Format date to Vietnamese format
     */
    static formatDate(date: Date | string): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return new Intl.DateTimeFormat('vi-VN').format(dateObj)
    }

    /**
     * Format datetime to Vietnamese format
     */
    static formatDateTime(date: Date | string): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(dateObj)
    }

    /**
     * Format phone number
     */
    static formatPhoneNumber(phone: string): string {
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
        }
        return phone
    }

    /**
     * Format file size
     */
    static formatFileSize(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return '0 Bytes'

        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return (
            Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
        )
    }

    /**
     * Format percentage
     */
    static formatPercentage(value: number, decimals: number = 2): string {
        return `${(value * 100).toFixed(decimals)}%`
    }

    /**
     * Slugify string
     */
    static slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    /**
     * Capitalize first letter
     */
    static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    }

    /**
     * Convert to title case
     */
    static toTitleCase(text: string): string {
        return text.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
    }

    /**
     * Truncate text
     */
    static truncate(
        text: string,
        length: number,
        suffix: string = '...'
    ): string {
        if (text.length <= length) return text
        return text.substring(0, length - suffix.length) + suffix
    }

    /**
     * Generate random string
     */
    static generateRandomString(length: number = 8): string {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
    }

    /**
     * Generate UUID v4
     */
    static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        })
    }

    /**
     * Mask sensitive data
     */
    static maskEmail(email: string): string {
        const [username, domain] = email.split('@')
        const maskedUsername =
            username.charAt(0) +
            '*'.repeat(username.length - 2) +
            username.charAt(username.length - 1)
        return `${maskedUsername}@${domain}`
    }

    /**
     * Mask phone number
     */
    static maskPhoneNumber(phone: string): string {
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length >= 4) {
            return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4)
        }
        return phone
    }

    /**
     * Generate order number
     */
    static generateOrderNumber(): string {
        const timestamp = Date.now().toString()
        const random = Math.random().toString(36).substr(2, 4).toUpperCase()
        return `ORD-${timestamp.slice(-6)}-${random}`
    }

    /**
     * Convert snake_case to camelCase
     */
    static toCamelCase(str: string): string {
        return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    }

    /**
     * Convert camelCase to snake_case
     */
    static toSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    }
}
