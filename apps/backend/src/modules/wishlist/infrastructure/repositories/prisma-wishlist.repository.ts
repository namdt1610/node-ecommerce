import { PrismaClient } from '@prisma/client'
import { IWishlistRepository } from '../../domain/interfaces/wishlist-repository.interface'
import {
    Wishlist,
    WishlistItem,
    AddToWishlistData,
    WishlistFilters,
    WishlistPagination,
} from '../../domain/entities/wishlist.entity'
import prisma from '@/config/database'

export class PrismaWishlistRepository implements IWishlistRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }

    async findByUserId(
        userId: string,
        pagination: WishlistPagination,
        filters?: WishlistFilters
    ): Promise<Wishlist | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { favorites: true },
        })

        if (!user || user.favorites.length === 0) {
            return null
        }

        // Get products from favorites
        const where: any = {
            id: { in: user.favorites },
        }

        // Apply filters
        if (filters?.priceRange) {
            where.price = {}
            if (filters.priceRange.min !== undefined)
                where.price.gte = filters.priceRange.min
            if (filters.priceRange.max !== undefined)
                where.price.lte = filters.priceRange.max
        }

        if (filters?.brand && filters.brand.length > 0) {
            where.brand = { in: filters.brand }
        }

        if (filters?.categoryId) {
            where.categoryId = filters.categoryId
        }

        const products = await this.prisma.product.findMany({
            where,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
            orderBy: this.buildOrderClause(pagination),
            include: {
                category: true,
            },
        })

        const items = products.map((product) =>
            this.mapToWishlistItem(userId, product)
        )

        return {
            id: userId, // Use userId as id for simplicity
            userId,
            items,
            totalItems: items.length,
            createdAt: new Date(), // Using current date as placeholder
            updatedAt: new Date(),
        }
    }

    async findWishlistItem(
        userId: string,
        productId: string,
        variantId?: string
    ): Promise<WishlistItem | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { favorites: true },
        })

        if (!user || !user.favorites.includes(productId)) {
            return null
        }

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                category: true,
            },
        })

        return product ? this.mapToWishlistItem(userId, product) : null
    }

    async addItem(data: AddToWishlistData): Promise<WishlistItem> {
        return this.addToWishlist(data)
    }

    async addToWishlist(data: AddToWishlistData): Promise<WishlistItem> {
        // Add to user's favorites array
        const updatedUser = await this.prisma.user.update({
            where: { id: data.userId },
            data: {
                favorites: {
                    push: data.productId,
                },
            },
        })

        // Get the product details
        const product = await this.prisma.product.findUnique({
            where: { id: data.productId },
            include: {
                category: true,
            },
        })

        if (!product) {
            throw new Error('Product not found')
        }

        return this.mapToWishlistItem(data.userId, product)
    }

    async removeItem(userId: string, productId: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { favorites: true },
        })

        if (user && user.favorites.includes(productId)) {
            const updatedFavorites = user.favorites.filter(
                (id) => id !== productId
            )

            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    favorites: updatedFavorites,
                },
            })
        }
    }

    async clearWishlist(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                favorites: [],
            },
        })
    }

    async getWishlistItemsCount(userId: string): Promise<number> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { favorites: true },
        })

        return user?.favorites.length || 0
    }

    async isInWishlist(userId: string, productId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { favorites: true },
        })

        return user?.favorites.includes(productId) || false
    }

    private buildOrderClause(pagination: WishlistPagination): any {
        const { sortBy, sortOrder } = pagination

        switch (sortBy) {
            case 'price':
                return { price: sortOrder }
            case 'name':
                return { name: sortOrder }
            case 'addedAt':
            default:
                return { createdAt: sortOrder }
        }
    }

    private mapToWishlistItem(userId: string, product: any): WishlistItem {
        return {
            id: `${userId}-${product.id}`, // Generate a composite ID
            wishlistId: userId, // Use userId as wishlistId for simplicity
            productId: product.id,
            product: product,
            addedAt: new Date(), // We don't have exact added date, use current
            priority: 'MEDIUM' as any, // Default priority
        }
    }

    private extractModel(name: string): string {
        // Try to extract model from product name
        // First try smartphone patterns (iPhone, Samsung Galaxy, etc.)
        const smartphoneMatch = name.match(
            /(iPhone|Galaxy|Pixel|OnePlus|Xiaomi)\s+([^\s,]+(?:\s+[^\s,]+)?)/i
        )
        if (smartphoneMatch) {
            return smartphoneMatch[2]
        }

        // Try laptop patterns (MacBook, ThinkPad, etc.)
        const laptopMatch = name.match(
            /(MacBook|ThinkPad|Inspiron|Pavilion|ZenBook)\s+([^\s,]+(?:\s+[^\s,]+)?)/i
        )
        if (laptopMatch) {
            return laptopMatch[2]
        }

        // Generic model extraction - try to get second part after brand
        const parts = name.split(' ')
        if (parts.length >= 2) {
            return parts.slice(1).join(' ').split(',')[0].trim()
        }

        return 'Standard'
    }

    private extractStorage(name: string): string {
        const match = name.match(/(\d+GB|\d+TB)/i)
        return match ? match[1] : '128GB'
    }

    private extractColor(name: string): string {
        const colors = [
            'Black',
            'White',
            'Red',
            'Blue',
            'Green',
            'Purple',
            'Pink',
            'Yellow',
        ]
        for (const color of colors) {
            if (name.toLowerCase().includes(color.toLowerCase())) {
                return color
            }
        }
        return 'Space Gray'
    }
}
