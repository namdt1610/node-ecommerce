// =================================
// SHARED TYPES INDEX
// =================================
// Central location for all shared type definitions
// to avoid duplication across the codebase

// Core entity types
export * from './user'
export * from './product'
export * from './category'
export * from './order'
export * from './cart'
export * from './auth'
export * from './api'
export * from './common'
export * from './dashboard'

// =================================
// COMMONLY USED INTERFACES
// =================================

// Standardized API Response wrapper
export interface StandardApiResponse<T = unknown> {
    success: boolean
    data: T
    message?: string
    error?: string
    timestamp?: string
}

// Pagination interfaces
export interface PaginationParams {
    page?: number
    limit?: number
    offset?: number
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

// Common status enums
export enum CommonStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    ARCHIVED = 'ARCHIVED',
}

// Sort and filter types
export type SortOrder = 'asc' | 'desc'
export type SortOption =
    | 'newest'
    | 'oldest'
    | 'name-asc'
    | 'name-desc'
    | 'price-asc'
    | 'price-desc'

// Component prop types
export interface BaseComponentProps {
    className?: string
    children?: React.ReactNode
    id?: string
}

export interface LoadingState {
    isLoading: boolean
    error?: string | null
}

export interface AsyncOperationState<T = unknown> extends LoadingState {
    data?: T
    lastUpdated?: Date
}
