"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCartContainer = createCartContainer;
const database_1 = __importDefault(require("@/config/database"));
// Import repositories
const prisma_cart_repository_1 = require("./infrastructure/repositories/prisma-cart.repository");
const prisma_product_repository_1 = require("../product/infrastructure/repositories/prisma-product.repository");
// Import use cases
const add_to_cart_usecase_1 = require("./application/use-cases/add-to-cart.usecase");
const get_cart_usecase_1 = require("./application/use-cases/get-cart.usecase");
const update_cart_item_usecase_1 = require("./application/use-cases/update-cart-item.usecase");
const remove_from_cart_usecase_1 = require("./application/use-cases/remove-from-cart.usecase");
const clear_cart_usecase_1 = require("./application/use-cases/clear-cart.usecase");
// Import controllers
const cart_controller_1 = require("./presentation/controllers/cart.controller");
function createCartContainer(prismaClient = database_1.default) {
    // Repositories
    const cartRepository = new prisma_cart_repository_1.PrismaCartRepository(prismaClient);
    const productRepository = new prisma_product_repository_1.PrismaProductRepository(prismaClient);
    // Use cases
    const addToCartUseCase = new add_to_cart_usecase_1.AddToCartUseCase(cartRepository, productRepository);
    const getCartUseCase = new get_cart_usecase_1.GetCartUseCase(cartRepository);
    const updateCartItemUseCase = new update_cart_item_usecase_1.UpdateCartItemUseCase(cartRepository, productRepository);
    const removeFromCartUseCase = new remove_from_cart_usecase_1.RemoveFromCartUseCase(cartRepository);
    const clearCartUseCase = new clear_cart_usecase_1.ClearCartUseCase(cartRepository);
    // Controllers
    const cartController = new cart_controller_1.CartController(addToCartUseCase, getCartUseCase, updateCartItemUseCase, removeFromCartUseCase, clearCartUseCase);
    return {
        cartRepository,
        productRepository,
        addToCartUseCase,
        getCartUseCase,
        updateCartItemUseCase,
        removeFromCartUseCase,
        clearCartUseCase,
        cartController,
    };
}
