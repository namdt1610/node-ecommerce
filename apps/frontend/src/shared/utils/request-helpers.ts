// =================================
// REQUEST HELPERS
// =================================
// Utilities for building and configuring HTTP requests

/**
 * Add authentication header if token exists
 */
export const withAuth = (config: Record<string, unknown> = {}) => {
    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if (token) {
        return {
            ...config,
            headers: {
                ...((config.headers as Record<string, unknown>) || {}),
                Authorization: `Bearer ${token}`,
            },
        }
    }

    return config
}

/**
 * Create query key for caching
 */
export const createQueryKey = (
    entity: string,
    id?: string | number,
    params?: Record<string, unknown>
): (string | number | Record<string, unknown>)[] => {
    const key: (string | number | Record<string, unknown>)[] = [entity]

    if (id !== undefined) {
        key.push(String(id))
    }

    if (params && Object.keys(params).length > 0) {
        // Sort params for consistent cache keys
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((acc, k) => ({ ...acc, [k]: params[k] }), {})
        key.push(sortedParams)
    }

    return key
}

/**
 * Build query string from params
 */
export const buildQueryString = (params: Record<string, unknown>): string => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value))
        }
    })

    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ''
}
