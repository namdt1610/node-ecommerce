/**
 * Validation Utilities
 * Functions for validating user input, data formats, and business rules
 */

/**
 * Email validation using standard regex pattern
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Vietnamese phone number validation
 * Accepts 10-11 digit phone numbers
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Password strength validation
 * Currently checks minimum length, can be enhanced with complexity rules
 */
export const isValidPassword = (password: string): boolean => {
    return password.length >= 6 // Basic validation, can be enhanced
}

/**
 * URL format validation
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Check if value is a valid Vietnamese postal code
 */
export const isValidPostalCode = (code: string): boolean => {
    const postalCodeRegex = /^[0-9]{5,6}$/
    return postalCodeRegex.test(code.replace(/\s/g, ''))
}

/**
 * Validate Vietnamese citizen ID (CCCD/CMND)
 */
export const isValidCitizenId = (id: string): boolean => {
    const citizenIdRegex = /^[0-9]{9,12}$/
    return citizenIdRegex.test(id.replace(/\s/g, ''))
}

/**
 * Check if string contains only Vietnamese characters and common punctuation
 */
export const isValidVietnameseName = (name: string): boolean => {
    const vietnameseNameRegex =
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸếệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵýỷỹ\s]+$/
    return vietnameseNameRegex.test(name)
}

/**
 * Validate price value (positive number)
 */
export const isValidPrice = (price: number | string): boolean => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return !isNaN(numPrice) && numPrice > 0
}

/**
 * Validate quantity (positive integer)
 */
export const isValidQuantity = (quantity: number | string): boolean => {
    const numQuantity =
        typeof quantity === 'string' ? parseInt(quantity) : quantity
    return Number.isInteger(numQuantity) && numQuantity > 0
}

/**
 * Validate required fields in request data
 */
export const validateRequiredFields = <T extends Record<string, unknown>>(
    data: T,
    requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } => {
    const missingFields: string[] = []

    requiredFields.forEach((field) => {
        if (
            data[field] === undefined ||
            data[field] === null ||
            data[field] === ''
        ) {
            missingFields.push(String(field))
        }
    })

    return {
        isValid: missingFields.length === 0,
        missingFields,
    }
}

/**
 * Sanitize data before sending to API
 */
export const sanitizeApiData = <T extends Record<string, unknown>>(
    data: T
): T => {
    const sanitized = { ...data }

    // Remove undefined and null values
    Object.keys(sanitized).forEach((key) => {
        if (sanitized[key] === undefined || sanitized[key] === null) {
            delete sanitized[key]
        }
    })

    return sanitized
}
