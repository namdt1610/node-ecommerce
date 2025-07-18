/**
 * Base DTO with common validation rules
 */
export abstract class BaseDTO {
    /**
     * Validate the DTO
     */
    abstract validate(): Promise<string[]>
}

/**
 * Base Create DTO
 */
export abstract class BaseCreateDTO extends BaseDTO {
    createdBy?: string
}

/**
 * Base Update DTO
 */
export abstract class BaseUpdateDTO extends BaseDTO {
    updatedBy?: string
}

/**
 * Pagination DTO
 */
export class PaginationDTO {
    page: number = 1
    limit: number = 10
    sortBy?: string
    sortOrder?: 'asc' | 'desc' = 'desc'

    constructor(data: Partial<PaginationDTO> = {}) {
        this.page = Math.max(1, data.page || 1)
        this.limit = Math.min(100, Math.max(1, data.limit || 10))
        this.sortBy = data.sortBy
        this.sortOrder = data.sortOrder || 'desc'
    }

    get offset(): number {
        return (this.page - 1) * this.limit
    }

    async validate(): Promise<string[]> {
        const errors: string[] = []

        if (this.page < 1) errors.push('Page must be greater than 0')
        if (this.limit < 1 || this.limit > 100)
            errors.push('Limit must be between 1 and 100')
        if (this.sortOrder && !['asc', 'desc'].includes(this.sortOrder)) {
            errors.push('Sort order must be asc or desc')
        }

        return errors
    }
}

/**
 * Base Response DTO
 */
export class BaseResponseDTO<T> {
    success: boolean
    message?: string
    data?: T
    errors?: string[]
    meta?: {
        pagination?: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
        [key: string]: any
    }

    constructor(data: {
        success: boolean
        message?: string
        data?: T
        errors?: string[]
        meta?: any
    }) {
        this.success = data.success
        this.message = data.message
        this.data = data.data
        this.errors = data.errors
        this.meta = data.meta
    }

    static success<T>(data: T, message?: string): BaseResponseDTO<T> {
        return new BaseResponseDTO({
            success: true,
            data,
            message,
        })
    }

    static error<T>(errors: string[], message?: string): BaseResponseDTO<T> {
        return new BaseResponseDTO({
            success: false,
            errors,
            message,
        })
    }

    static paginated<T>(
        data: T[],
        pagination: {
            page: number
            limit: number
            total: number
        },
        message?: string
    ): BaseResponseDTO<T[]> {
        return new BaseResponseDTO({
            success: true,
            data,
            message,
            meta: {
                pagination: {
                    ...pagination,
                    totalPages: Math.ceil(pagination.total / pagination.limit),
                },
            },
        })
    }
}
