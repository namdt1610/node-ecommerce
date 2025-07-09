import { PrismaClient } from '@prisma/client'
import prisma from '@/config/database'

// Import repositories
import { PrismaCartRepository } from './infrastructure/repositories/prisma-cart.repository'
import { PrismaProductRepository } from '../product/infrastructure/repositories/prisma-product.repository'

// Import interfaces
import { ICartRepository } from './domain/interfaces/cart-repository.interface'
import { IProductRepository } from '../product/domain/interfaces/product-repository.interface'

// Import use cases
import { AddToCartUseCase } from './application/use-cases/add-to-cart.usecase'
import { GetCartUseCase } from './application/use-cases/get-cart.usecase'
import { UpdateCartItemUseCase } from './application/use-cases/update-cart-item.usecase'
import { RemoveFromCartUseCase } from './application/use-cases/remove-from-cart.usecase'
import { ClearCartUseCase } from './application/use-cases/clear-cart.usecase'

// Import controllers
import { CartController } from './presentation/controllers/cart.controller'

export interface CartContainer {
    cartRepository: ICartRepository
    productRepository: IProductRepository
    addToCartUseCase: AddToCartUseCase
    getCartUseCase: GetCartUseCase
    updateCartItemUseCase: UpdateCartItemUseCase
    removeFromCartUseCase: RemoveFromCartUseCase
    clearCartUseCase: ClearCartUseCase
    cartController: CartController
}

export function createCartContainer(
    prismaClient: PrismaClient = prisma
): CartContainer {
    // Repositories
    const cartRepository = new PrismaCartRepository(prismaClient)
    const productRepository = new PrismaProductRepository(prismaClient)

    // Use cases
    const addToCartUseCase = new AddToCartUseCase(
        cartRepository,
        productRepository
    )
    const getCartUseCase = new GetCartUseCase(cartRepository)
    const updateCartItemUseCase = new UpdateCartItemUseCase(
        cartRepository,
        productRepository
    )
    const removeFromCartUseCase = new RemoveFromCartUseCase(cartRepository)
    const clearCartUseCase = new ClearCartUseCase(cartRepository)

    // Controllers
    const cartController = new CartController(
        addToCartUseCase,
        getCartUseCase,
        updateCartItemUseCase,
        removeFromCartUseCase,
        clearCartUseCase
    )

    return {
        cartRepository,
        productRepository,
        addToCartUseCase,
        getCartUseCase,
        updateCartItemUseCase,
        removeFromCartUseCase,
        clearCartUseCase,
        cartController,
    }
}
