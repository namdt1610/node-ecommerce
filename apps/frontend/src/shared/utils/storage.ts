/**
 * Local Storage Utilities
 * Safe wrappers for browser localStorage with TypeScript support
 */

/**
 * Local storage helper with type safety and error handling
 */
export const storage = {
    /**
     * Get item from localStorage with type safety
     */
    get: <T>(key: string): T | null => {
        if (typeof window === 'undefined') return null
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        } catch {
            return null
        }
    },

    /**
     * Set item to localStorage
     */
    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {
            // Handle storage errors silently
        }
    },

    /**
     * Remove item from localStorage
     */
    remove: (key: string): void => {
        if (typeof window === 'undefined') return
        localStorage.removeItem(key)
    },

    /**
     * Clear all localStorage
     */
    clear: (): void => {
        if (typeof window === 'undefined') return
        localStorage.clear()
    },

    /**
     * Check if key exists in localStorage
     */
    has: (key: string): boolean => {
        if (typeof window === 'undefined') return false
        return localStorage.getItem(key) !== null
    },

    /**
     * Get all keys in localStorage
     */
    keys: (): string[] => {
        if (typeof window === 'undefined') return []
        return Object.keys(localStorage)
    },

    /**
     * Get localStorage size in bytes (approximate)
     */
    size: (): number => {
        if (typeof window === 'undefined') return 0
        let total = 0
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length
            }
        }
        return total
    },
}
