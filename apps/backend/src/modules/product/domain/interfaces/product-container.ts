import { IProductRepository } from './product-repository.interface'
import { CreateProductUseCase } from '../../application/use-cases/create-product.usecase'
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.usecase'
import { GetAllProductsUseCase } from '../../application/use-cases/get-all-products.usecase'
import { UpdateProductUseCase } from '../../application/use-cases/update-product.usecase'
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.usecase'
import { SearchProductsUseCase } from '../../application/use-cases/search-products.usecase'

// DI Container Interface
export interface IProductContainer {
    productRepository: IProductRepository
    createProductUseCase: CreateProductUseCase
    getProductByIdUseCase: GetProductByIdUseCase
    getAllProductsUseCase: GetAllProductsUseCase
    updateProductUseCase: UpdateProductUseCase
    deleteProductUseCase: DeleteProductUseCase
    searchProductsUseCase: SearchProductsUseCase
}

// Factory type for creating container
export type ProductContainerFactory = () => IProductContainer
