"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToWishlistUseCase = void 0;
const wishlist_dto_1 = require("../dto/wishlist.dto");
const wishlist_errors_1 = require("../../domain/errors/wishlist-errors");
const product_errors_1 = require("../../../product/domain/errors/product-errors");
class AddToWishlistUseCase {
    wishlistRepository;
    productRepository;
    constructor(wishlistRepository, productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }
    async execute(userId, dto) {
        // Validate input
        const validatedDto = wishlist_dto_1.AddToWishlistSchema.parse(dto);
        // Check if product exists
        const product = await this.productRepository.findById(validatedDto.productId);
        if (!product) {
            throw new product_errors_1.ProductErrors.ProductNotFoundError(dto.productId);
        }
        // Check if item already exists in wishlist
        const existingItem = await this.wishlistRepository.findWishlistItem(userId, validatedDto.productId, validatedDto.variantId);
        if (existingItem) {
            throw new wishlist_errors_1.WishlistErrors.ItemAlreadyInWishlistError('Item is already in wishlist');
        }
        // Add to wishlist
        return await this.wishlistRepository.addToWishlist({
            userId,
            productId: validatedDto.productId,
            variantId: validatedDto.variantId,
            notes: validatedDto.notes,
            priority: validatedDto.priority,
            priceAlert: validatedDto.priceAlert,
        });
    }
}
exports.AddToWishlistUseCase = AddToWishlistUseCase;
