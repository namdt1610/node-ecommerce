import { ProductController } from './presentation/controllers/product.controller'
import { CreateProductUseCase } from './application/use-cases/create-product.usecase'
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.usecase'
import { GetAllProductsUseCase } from './application/use-cases/get-all-products.usecase'
import { GetProductsCountUseCase } from './application/use-cases/get-products-count.use-case'
import { UpdateProductUseCase } from './application/use-cases/update-product.usecase'
import { DeleteProductUseCase } from './application/use-cases/delete-product.usecase'
import { SearchProductsUseCase } from './application/use-cases/search-products.usecase'
import { ProductRepository } from './infrastructure/repositories/product.repository'
import prisma from '../../config/database'

// Create Product Controller with DI
export function createProductController(): ProductController {
    const productRepository = new ProductRepository(prisma)

    const createProductUseCase = new CreateProductUseCase(productRepository)
    const getProductByIdUseCase = new GetProductByIdUseCase(productRepository)
    const getAllProductsUseCase = new GetAllProductsUseCase(productRepository)
    const getProductsCountUseCase = new GetProductsCountUseCase(
        productRepository
    )
    const updateProductUseCase = new UpdateProductUseCase(productRepository)
    const deleteProductUseCase = new DeleteProductUseCase(productRepository)
    const searchProductsUseCase = new SearchProductsUseCase(productRepository)

    return new ProductController(
        createProductUseCase,
        getProductByIdUseCase,
        getAllProductsUseCase,
        getProductsCountUseCase,
        updateProductUseCase,
        deleteProductUseCase,
        searchProductsUseCase
    )
}
