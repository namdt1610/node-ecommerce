/**
 * Object Manipulation Utilities
 * Functions for object operations, deep cloning, and property management
 */

/**
 * Deep clone an object (simple implementation)
 */
export const deepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as T
    if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T
    if (typeof obj === 'object') {
        const clonedObj = {} as T
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key])
            }
        }
        return clonedObj
    }
    return obj
}

/**
 * Check if object/array is empty
 */
export const isEmpty = (obj: unknown): boolean => {
    if (obj === null || obj === undefined) return true
    if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0
    if (typeof obj === 'object') return Object.keys(obj).length === 0
    return false
}

/**
 * Pick specific keys from object
 */
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> => {
    const result = {} as Pick<T, K>
    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key]
        }
    })
    return result
}

/**
 * Omit specific keys from object
 */
export const omit = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> => {
    const result = { ...obj } as Omit<T, K>
    keys.forEach((key) => {
        delete (result as T)[key]
    })
    return result
}

/**
 * Merge objects deeply
 */
export const deepMerge = <T extends Record<string, unknown>>(
    target: T,
    ...sources: Partial<T>[]
): T => {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                deepMerge(
                    target[key] as Record<string, unknown>,
                    source[key] as Record<string, unknown>
                )
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return deepMerge(target, ...sources)
}

/**
 * Check if value is a plain object
 */
export const isObject = (item: unknown): item is Record<string, unknown> => {
    return item !== null && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Get nested object property safely
 */
export const getNestedProperty = <T>(
    obj: Record<string, unknown>,
    path: string,
    defaultValue?: T
): T | undefined => {
    const keys = path.split('.')
    let result: unknown = obj

    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = (result as Record<string, unknown>)[key]
        } else {
            return defaultValue
        }
    }

    return result as T
}

/**
 * Set nested object property
 */
export const setNestedProperty = (
    obj: Record<string, unknown>,
    path: string,
    value: unknown
): void => {
    const keys = path.split('.')
    const lastKey = keys.pop()
    let current = obj

    for (const key of keys) {
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {}
        }
        current = current[key] as Record<string, unknown>
    }

    if (lastKey) {
        current[lastKey] = value
    }
}

/**
 * Transform object keys
 */
export const transformKeys = <T extends Record<string, unknown>>(
    obj: T,
    transformer: (key: string) => string
): Record<string, unknown> => {
    const result: Record<string, unknown> = {}

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[transformer(key)] = obj[key]
        }
    }

    return result
}
