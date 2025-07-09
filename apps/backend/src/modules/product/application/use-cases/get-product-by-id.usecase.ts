import { ProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface'
import { ProductResponseDto } from '../../dto'
import { mapProductToResponseDto } from '../mappers/product.mapper'

export class GetProductByIdUseCase {
    constructor(private productRepository: ProductRepositoryInterface) {}

    async execute(id: string): Promise<ProductResponseDto | null> {
        const product = await this.productRepository.findById(id)
        if (!product) return null
        return mapProductToResponseDto(product)
    }
}
