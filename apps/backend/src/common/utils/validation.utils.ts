/**
 * Common validation utilities
 */
export class ValidationUtils {
    /**
     * Validate UUID format
     */
    static isValidUUID(id: string): boolean {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        return uuidRegex.test(id)
    }

    /**
     * Validate email format
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    /**
     * Validate phone number (Vietnamese format)
     */
    static isValidPhoneNumber(phone: string): boolean {
        const phoneRegex = /^(\+84|84|0)?[1-9][0-9]{8,9}$/
        return phoneRegex.test(phone.replace(/\s/g, ''))
    }

    /**
     * Validate password strength
     */
    static isValidPassword(password: string): boolean {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
        return passwordRegex.test(password)
    }

    /**
     * Validate required fields
     */
    static validateRequiredFields(
        data: any,
        requiredFields: string[]
    ): string[] {
        const errors: string[] = []

        for (const field of requiredFields) {
            if (!data[field] && data[field] !== 0 && data[field] !== false) {
                errors.push(`${field} is required`)
            }
        }

        return errors
    }

    /**
     * Validate field types
     */
    static validateFieldTypes(
        data: any,
        fieldTypes: Record<string, string>
    ): string[] {
        const errors: string[] = []

        for (const [field, expectedType] of Object.entries(fieldTypes)) {
            if (
                data[field] !== undefined &&
                typeof data[field] !== expectedType
            ) {
                errors.push(`${field} must be of type ${expectedType}`)
            }
        }

        return errors
    }

    /**
     * Validate string length
     */
    static validateStringLength(
        value: string,
        field: string,
        min?: number,
        max?: number
    ): string[] {
        const errors: string[] = []

        if (min && value.length < min) {
            errors.push(`${field} must be at least ${min} characters`)
        }

        if (max && value.length > max) {
            errors.push(`${field} must not exceed ${max} characters`)
        }

        return errors
    }

    /**
     * Validate number range
     */
    static validateNumberRange(
        value: number,
        field: string,
        min?: number,
        max?: number
    ): string[] {
        const errors: string[] = []

        if (min !== undefined && value < min) {
            errors.push(`${field} must be at least ${min}`)
        }

        if (max !== undefined && value > max) {
            errors.push(`${field} must not exceed ${max}`)
        }

        return errors
    }

    /**
     * Validate enum values
     */
    static validateEnum(
        value: any,
        field: string,
        enumValues: any[]
    ): string[] {
        const errors: string[] = []

        if (!enumValues.includes(value)) {
            errors.push(`${field} must be one of: ${enumValues.join(', ')}`)
        }

        return errors
    }

    /**
     * Sanitize input string
     */
    static sanitizeString(input: string): string {
        return input.trim().replace(/[<>\"'%;()&+]/g, '')
    }

    /**
     * Validate date format
     */
    static isValidDate(date: string): boolean {
        const dateObj = new Date(date)
        return !isNaN(dateObj.getTime())
    }

    /**
     * Validate future date
     */
    static isFutureDate(date: string): boolean {
        const dateObj = new Date(date)
        return dateObj > new Date()
    }

    /**
     * Validate past date
     */
    static isPastDate(date: string): boolean {
        const dateObj = new Date(date)
        return dateObj < new Date()
    }
}
