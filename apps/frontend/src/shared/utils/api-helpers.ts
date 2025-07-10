// =================================
// API HELPERS - BACKWARD COMPATIBILITY
// =================================
// Re-exports from specialized files for backward compatibility
// This file will be deprecated in favor of importing from specific modules

// Data transformers
export {
    transformBackendOrder,
    extractApiData,
    extractAxiosData,
    transformOrderList,
    transformOrderResponse,
} from './transformers'

// Error handling
export {
    shouldNotRetry,
    createRetryConfig,
    extractErrorMessage,
} from './error-handlers'

// Request helpers
export { withAuth, createQueryKey, buildQueryString } from './request-helpers'

// Validation
export { validateRequiredFields, sanitizeApiData } from './validation'
