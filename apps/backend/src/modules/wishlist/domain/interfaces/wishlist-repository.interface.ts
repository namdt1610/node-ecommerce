import {
    Wishlist,
    WishlistItem,
    AddToWishlistData,
    WishlistFilters,
    WishlistPagination,
} from '../entities/wishlist.entity'

export interface IWishlistRepository {
    findByUserId(
        userId: string,
        pagination: WishlistPagination,
        filters?: WishlistFilters
    ): Promise<Wishlist | null>
    findWishlistItem(
        userId: string,
        productId: string,
        variantId?: string
    ): Promise<WishlistItem | null>
    addItem(data: AddToWishlistData): Promise<WishlistItem>
    addToWishlist(data: AddToWishlistData): Promise<WishlistItem>
    removeItem(userId: string, productId: string): Promise<void>
    clearWishlist(userId: string): Promise<void>
    getWishlistItemsCount(userId: string): Promise<number>
    isInWishlist(userId: string, productId: string): Promise<boolean>
}
