import { Product } from '../../../product/domain/entities/product.entity'

export interface Wishlist {
    id: string
    userId: string
    items: WishlistItem[]
    totalItems: number
    createdAt: Date
    updatedAt: Date
}

export interface WishlistItem {
    id: string
    wishlistId: string
    productId: string
    product?: Product
    variantId?: string
    addedAt: Date
    notes?: string
    priority: WishlistPriority
    priceAlert?: PriceAlert
}

export enum WishlistPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export interface PriceAlert {
    targetPrice: number
    isActive: boolean
    notificationSent: boolean
    createdAt: Date
}

export interface AddToWishlistData {
    userId: string
    productId: string
    variantId?: string
    notes?: string
    priority?: WishlistPriority
    priceAlert?: {
        targetPrice: number
        isActive: boolean
    }
}

export interface UpdateWishlistItemData {
    notes?: string
    priority?: WishlistPriority
    priceAlert?: {
        targetPrice: number
        isActive: boolean
    }
}

export interface WishlistFilters {
    priority?: WishlistPriority[]
    categoryId?: string
    brand?: string[]
    priceRange?: {
        min: number
        max: number
    }
    availability?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ALL'
    sortBy?: 'addedAt' | 'priority' | 'price' | 'name'
    sortOrder?: 'asc' | 'desc'
}

export interface WishlistAnalytics {
    totalItems: number
    totalValue: number
    averagePrice: number
    categoriesBreakdown: { [categoryName: string]: number }
    brandsBreakdown: { [brandName: string]: number }
    prioritiesBreakdown: { [priority: string]: number }
    priceAlertsCount: number
    outOfStockCount: number
}

// Enhanced wishlist operations
export interface WishlistOperations {
    calculateTotalValue(): number
    getOutOfStockItems(): WishlistItem[]
    getPriceDropItems(): WishlistItem[]
    getBackInStockItems(): WishlistItem[]
    generateAnalytics(): WishlistAnalytics
    exportToCart(itemIds: string[]): Promise<void>
    shareWishlist(): string // Returns shareable link
}

export interface WishlistShareData {
    id: string
    shareToken: string
    isPublic: boolean
    allowCopyToCart: boolean
    expiresAt?: Date
    viewCount: number
    createdAt: Date
}

export interface PublicWishlistView {
    id: string
    ownerName?: string
    title?: string
    description?: string
    items: PublicWishlistItem[]
    totalItems: number
    allowCopyToCart: boolean
    createdAt: Date
}

export interface PublicWishlistItem {
    productId: string
    product: {
        id: string
        name: string
        brand: string
        price: number
        originalPrice: number
        images: Array<{ url: string; alt: string }>
        availability: boolean
    }
    variantId?: string
    addedAt: Date
    notes?: string
    priority: WishlistPriority
}

export interface WishlistPagination {
    page: number
    limit: number
    sortBy?: 'addedAt' | 'priority' | 'price' | 'name'
    sortOrder?: 'asc' | 'desc'
}
