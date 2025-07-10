/**
 * DOM and Performance Utilities
 * Functions for DOM manipulation, event handling, and performance optimization
 */

/**
 * Debounce function with TypeScript support
 * Delays function execution until after the specified delay
 */
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

/**
 * Throttle function
 * Limits function execution to once per specified interval
 */
export const throttle = <T extends (...args: unknown[]) => void>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

/**
 * Combine CSS classes safely
 * Filters out falsy values and joins classes
 */
export const cn = (
    ...classes: (string | undefined | null | false)[]
): string => {
    return classes.filter(Boolean).join(' ')
}
