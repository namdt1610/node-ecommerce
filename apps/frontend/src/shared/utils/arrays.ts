/**
 * Array Manipulation Utilities
 * Functions for common array operations and transformations
 */

/**
 * Remove duplicates from array
 */
export const uniqueArray = <T>(array: T[]): T[] => {
    return [...new Set(array)]
}

/**
 * Group array items by a specified key
 */
export const groupBy = <T, K extends keyof T>(
    array: T[],
    key: K
): Record<string, T[]> => {
    return array.reduce((groups: Record<string, T[]>, item) => {
        const groupKey = String(item[key])
        if (!groups[groupKey]) {
            groups[groupKey] = []
        }
        groups[groupKey].push(item)
        return groups
    }, {})
}

/**
 * Sort array by a specified key
 */
export const sortBy = <T>(
    array: T[],
    key: keyof T,
    order: 'asc' | 'desc' = 'asc'
): T[] => {
    return [...array].sort((a, b) => {
        const aVal = a[key]
        const bVal = b[key]

        if (aVal < bVal) return order === 'asc' ? -1 : 1
        if (aVal > bVal) return order === 'asc' ? 1 : -1
        return 0
    })
}

/**
 * Chunk array into smaller arrays of specified size
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

/**
 * Shuffle array randomly
 */
export const shuffle = <T>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

/**
 * Find array difference (items in first array but not in second)
 */
export const difference = <T>(array1: T[], array2: T[]): T[] => {
    return array1.filter((item) => !array2.includes(item))
}

/**
 * Find array intersection (items common to both arrays)
 */
export const intersection = <T>(array1: T[], array2: T[]): T[] => {
    return array1.filter((item) => array2.includes(item))
}

/**
 * Flatten nested arrays
 */
export const flatten = <T>(array: (T | T[])[]): T[] => {
    return array.reduce<T[]>((acc, val) => {
        return Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val)
    }, [])
}

/**
 * Get the last N items from array
 */
export const takeLast = <T>(array: T[], count: number): T[] => {
    return array.slice(-count)
}

/**
 * Get the first N items from array
 */
export const takeFirst = <T>(array: T[], count: number): T[] => {
    return array.slice(0, count)
}
