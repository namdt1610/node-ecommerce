export interface Product {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    imageUrl?: string
    images?: string[]
    variants?: ProductVariant[]
    category: {
        id: string
        name: string
    }
    createdAt: string
    updatedAt: string
}

export interface ProductVariant {
    id: string
    name: string
    sku: string
    price: number
    originalPrice: number
    attributes: VariantAttribute[]
    images: VariantImage[]
    inventory: {
        quantity: number
        reservedQuantity: number
        availableQuantity: number
        lowStockThreshold: number
    }
    isActive: boolean
}

export interface VariantAttribute {
    name: string
    value: string
}

export interface VariantImage {
    url: string
    alt: string
    position: number
    isPrimary: boolean
}

export interface ProductData {
    name: string
    description?: string
    price: number
    imageUrl?: string
    categoryId: string
}

export type SortOption =
    | 'name-asc'
    | 'name-desc'
    | 'price-asc'
    | 'price-desc'
    | 'newest'
    | 'oldest'
