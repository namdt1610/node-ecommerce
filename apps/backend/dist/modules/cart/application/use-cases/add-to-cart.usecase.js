"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToCartUseCase = void 0;
const cart_dto_1 = require("../dto/cart.dto");
const cart_errors_1 = require("../../domain/errors/cart-errors");
const product_errors_1 = require("../../../product/domain/errors/product-errors");
class AddToCartUseCase {
    cartRepository;
    productRepository;
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }
    async execute(userId, dto) {
        // Validate input
        const validatedDto = cart_dto_1.AddToCartSchema.parse(dto);
        // Check if product exists and is available
        const product = await this.productRepository.findById(validatedDto.productId);
        if (!product) {
            throw new product_errors_1.ProductErrors.ProductNotFoundError(dto.productId);
        }
        if (!product.isActive) {
            throw new product_errors_1.ProductErrors.ProductNotAvailableError('Product is not available');
        }
        // Check inventory availability
        const availableQuantity = await this.productRepository.getAvailableQuantity(validatedDto.productId);
        if (availableQuantity < validatedDto.quantity) {
            throw new cart_errors_1.CartErrors.InsufficientStockError(`Only ${availableQuantity} items available`);
        }
        // Check if item already exists in cart (no variants support for now)
        const existingItem = await this.cartRepository.findCartItem(userId, validatedDto.productId);
        if (existingItem) {
            // Update existing item quantity
            const newQuantity = existingItem.quantity + validatedDto.quantity;
            // Check total quantity availability
            if (availableQuantity < newQuantity) {
                throw new cart_errors_1.CartErrors.InsufficientStockError(`Only ${availableQuantity} items available`);
            }
            return await this.cartRepository.updateItem(existingItem.id, {
                quantity: newQuantity,
            });
        }
        else {
            // Add new item to cart
            return await this.cartRepository.addItem({
                userId,
                productId: validatedDto.productId,
                quantity: validatedDto.quantity,
            });
        }
    }
}
exports.AddToCartUseCase = AddToCartUseCase;
