// =================================
// ERROR HANDLERS
// =================================
// Utilities for handling API errors and retry logic

/**
 * Check if error should not be retried (auth errors, not found, etc.)
 */
export const shouldNotRetry = (error: unknown): boolean => {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } }
        const status = axiosError.response?.status
        return [401, 403, 404, 422].includes(status)
    }
    return false
}

/**
 * Create retry configuration for React Query
 */
export const createRetryConfig = (maxRetries: number = 3) => ({
    retry: (failureCount: number, error: unknown) => {
        if (shouldNotRetry(error)) {
            return false
        }
        return failureCount < maxRetries
    },
    retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
})

/**
 * Extract error message from various error formats
 */
export const extractErrorMessage = (error: unknown): string => {
    if (!error) return 'Unknown error occurred'

    // Axios error with response
    if (typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
            response: {
                data?: { message?: string; error?: string }
                status?: number
            }
        }

        const data = axiosError.response?.data
        if (data?.message) return data.message
        if (data?.error) return data.error

        const status = axiosError.response?.status
        if (status === 401) return 'Unauthorized access'
        if (status === 403) return 'Access forbidden'
        if (status === 404) return 'Resource not found'
        if (status === 500) return 'Server error'
    }

    // Standard Error object
    if (error instanceof Error) {
        return error.message
    }

    // String error
    if (typeof error === 'string') {
        return error
    }

    return 'An unexpected error occurred'
}
