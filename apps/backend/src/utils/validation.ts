// UUID validation utilities
export const isValidUUID = (uuid: string): boolean => {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
}

// CUID validation utilities (for Prisma generated IDs)
export const isValidCUID = (cuid: string): boolean => {
    // CUID format: c + timestamp + counter + random + fingerprint
    // Example: cmcumcf7o000k9ff02gkzr89v
    const cuidRegex = /^c[0-9a-z]{24}$/i
    return cuidRegex.test(cuid)
}

// Combined ID validation (supports both UUID and CUID)
export const isValidId = (id: string): boolean => {
    return isValidUUID(id) || isValidCUID(id)
}

export const validateUUID = (value: any, fieldName: string): string => {
    if (!value) {
        throw new Error(`${fieldName} is required`)
    }

    if (typeof value !== 'string') {
        throw new Error(
            `${fieldName} must be a string, received: ${typeof value}`
        )
    }

    if (!isValidUUID(value)) {
        throw new Error(`${fieldName} must be a valid UUID, received: ${value}`)
    }

    return value
}

export const validateId = (value: any, fieldName: string): string => {
    if (!value) {
        throw new Error(`${fieldName} is required`)
    }

    if (typeof value !== 'string') {
        throw new Error(
            `${fieldName} must be a string, received: ${typeof value}`
        )
    }

    if (!isValidId(value)) {
        throw new Error(`${fieldName} must be a valid ID, received: ${value}`)
    }

    return value
}

export const debugValue = (value: any, fieldName: string): void => {
    console.log(`=== DEBUG ${fieldName} ===`, {
        value,
        type: typeof value,
        length: typeof value === 'string' ? value.length : 'N/A',
        isValidUUID: typeof value === 'string' ? isValidUUID(value) : false,
        isValidCUID: typeof value === 'string' ? isValidCUID(value) : false,
        isValidId: typeof value === 'string' ? isValidId(value) : false,
    })
}

// Order validation helpers
export const validateOrderData = (data: any): void => {
    console.log('=== VALIDATING ORDER DATA ===', data)

    if (!data) {
        throw new Error('Order data is required')
    }

    if (!data.userId) {
        throw new Error('User ID is required')
    }

    debugValue(data.userId, 'userId')
    validateId(data.userId, 'userId')

    if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Items array is required')
    }

    if (data.items.length === 0) {
        throw new Error('At least one item is required')
    }

    data.items.forEach((item: any, index: number) => {
        console.log(`=== VALIDATING ITEM ${index} ===`, item)

        if (!item.productId) {
            throw new Error(`Item ${index}: productId is required`)
        }

        debugValue(item.productId, `items.${index}.productId`)
        validateId(item.productId, `items.${index}.productId`)

        if (
            !item.quantity ||
            typeof item.quantity !== 'number' ||
            item.quantity <= 0
        ) {
            throw new Error(`Item ${index}: quantity must be a positive number`)
        }

        if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
            throw new Error(`Item ${index}: price must be a positive number`)
        }
    })
}
