import { PrismaClient } from '@prisma/client'
import {
    PaginationOptions,
    SortingOptions,
    QueryFilters,
} from '../base/base.repository'

/**
 * Database utilities for common operations
 */
export class DatabaseUtils {
    /**
     * Build Prisma pagination query
     */
    static buildPaginationQuery(options?: PaginationOptions) {
        if (!options) return {}

        return {
            skip: options.offset || (options.page - 1) * options.limit,
            take: options.limit,
        }
    }

    /**
     * Build Prisma sorting query
     */
    static buildSortingQuery(options?: SortingOptions) {
        if (!options) return {}

        return {
            orderBy: {
                [options.field]: options.direction,
            },
        }
    }

    /**
     * Build Prisma where clause from filters
     */
    static buildWhereClause(filters?: QueryFilters) {
        if (!filters) return {}

        const where: any = {}

        for (const [key, value] of Object.entries(filters)) {
            if (value === null || value === undefined) continue

            // Handle different filter types
            if (typeof value === 'string') {
                // String search
                where[key] = {
                    contains: value,
                    mode: 'insensitive',
                }
            } else if (
                typeof value === 'object' &&
                value.hasOwnProperty('gte')
            ) {
                // Range filter
                where[key] = value
            } else if (Array.isArray(value)) {
                // In filter
                where[key] = {
                    in: value,
                }
            } else {
                // Exact match
                where[key] = value
            }
        }

        return where
    }

    /**
     * Execute transaction with retry logic
     */
    static async executeTransaction<T>(
        prisma: PrismaClient,
        operations: (tx: any) => Promise<T>,
        maxRetries: number = 3
    ): Promise<T> {
        let lastError: Error

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await prisma.$transaction(operations)
            } catch (error) {
                lastError = error as Error

                // Check if error is retryable
                if (this.isRetryableError(error) && attempt < maxRetries) {
                    await this.delay(attempt * 1000) // Exponential backoff
                    continue
                }

                throw error
            }
        }

        throw lastError!
    }

    /**
     * Check if database error is retryable
     */
    private static isRetryableError(error: any): boolean {
        const retryableCodes = [
            'P2002', // Unique constraint violation
            'P2034', // Transaction conflicts
            'P2024', // Connection timeout
        ]

        return retryableCodes.includes(error.code)
    }

    /**
     * Delay utility for retries
     */
    private static delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    /**
     * Build include relations query
     */
    static buildIncludeQuery(relations?: string[]) {
        if (!relations || relations.length === 0) return {}

        const include: any = {}

        for (const relation of relations) {
            // Handle nested relations (e.g., 'user.profile')
            const parts = relation.split('.')
            let current = include

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i]

                if (i === parts.length - 1) {
                    current[part] = true
                } else {
                    if (!current[part]) {
                        current[part] = { include: {} }
                    }
                    current = current[part].include
                }
            }
        }

        return { include }
    }

    /**
     * Build select fields query
     */
    static buildSelectQuery(fields?: string[]) {
        if (!fields || fields.length === 0) return {}

        const select: any = {}

        for (const field of fields) {
            select[field] = true
        }

        return { select }
    }

    /**
     * Format database error message
     */
    static formatDatabaseError(error: any): string {
        if (error.code === 'P2002') {
            return `Duplicate entry for ${error.meta?.target?.join(', ') || 'unique field'}`
        }

        if (error.code === 'P2025') {
            return 'Record not found'
        }

        if (error.code === 'P2003') {
            return 'Foreign key constraint violation'
        }

        if (error.code === 'P2014') {
            return 'Invalid relation reference'
        }

        return error.message || 'Database operation failed'
    }

    /**
     * Validate database connection
     */
    static async validateConnection(prisma: PrismaClient): Promise<boolean> {
        try {
            await prisma.$queryRaw`SELECT 1`
            return true
        } catch (error) {
            console.error('Database connection failed:', error)
            return false
        }
    }

    /**
     * Get database statistics
     */
    static async getDatabaseStats(prisma: PrismaClient) {
        try {
            const result = (await prisma.$queryRaw`
                SELECT 
                    schemaname,
                    tablename,
                    attname,
                    n_distinct,
                    correlation
                FROM pg_stats 
                WHERE schemaname = 'public'
                LIMIT 10
            `) as any[]

            return result
        } catch (error) {
            console.error('Failed to get database stats:', error)
            return []
        }
    }

    /**
     * Clean up old records
     */
    static async cleanupOldRecords(
        prisma: PrismaClient,
        tableName: string,
        dateField: string,
        daysOld: number
    ): Promise<number> {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysOld)

        try {
            const result = await (prisma as any)[tableName].deleteMany({
                where: {
                    [dateField]: {
                        lt: cutoffDate,
                    },
                },
            })

            return result.count
        } catch (error) {
            console.error(
                `Failed to cleanup old records from ${tableName}:`,
                error
            )
            return 0
        }
    }
}
