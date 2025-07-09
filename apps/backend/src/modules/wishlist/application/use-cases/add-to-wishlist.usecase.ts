import { IProductRepository } from '../../../product/domain/interfaces/product-repository.interface'
import { IWishlistRepository } from '../../domain/interfaces/wishlist-repository.interface'
import { AddToWishlistDto, AddToWishlistSchema } from '../dto/wishlist.dto'
import { WishlistItem } from '../../domain/entities/wishlist.entity'
import { WishlistErrors } from '../../domain/errors/wishlist-errors'
import { ProductErrors } from '../../../product/domain/errors/product-errors'

export class AddToWishlistUseCase {
    constructor(
        private wishlistRepository: IWishlistRepository,
        private productRepository: IProductRepository
    ) {}

    async execute(
        userId: string,
        dto: AddToWishlistDto
    ): Promise<WishlistItem> {
        // Validate input
        const validatedDto = AddToWishlistSchema.parse(dto)

        // Check if product exists
        const product = await this.productRepository.findById(
            validatedDto.productId
        )
        if (!product) {
            throw new ProductErrors.ProductNotFoundError(dto.productId)
        }

        // Check if item already exists in wishlist
        const existingItem = await this.wishlistRepository.findWishlistItem(
            userId,
            validatedDto.productId,
            validatedDto.variantId
        )

        if (existingItem) {
            throw new WishlistErrors.ItemAlreadyInWishlistError(
                'Item is already in wishlist'
            )
        }

        // Add to wishlist
        return await this.wishlistRepository.addToWishlist({
            userId,
            productId: validatedDto.productId,
            variantId: validatedDto.variantId,
            notes: validatedDto.notes,
            priority: validatedDto.priority,
            priceAlert: validatedDto.priceAlert,
        })
    }
}
