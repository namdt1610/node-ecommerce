import { ProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface'
import { UpdateProductDto, ProductResponseDto } from '../../dto'
import { mapProductToResponseDto } from '../mappers/product.mapper'

export class UpdateProductUseCase {
    constructor(private productRepository: ProductRepositoryInterface) {}

    async execute(
        id: string,
        updateProductDto: UpdateProductDto
    ): Promise<ProductResponseDto> {
        const updateData: any = { ...updateProductDto }
        if (updateProductDto.categoryId) {
            updateData.category = {
                connect: { id: updateProductDto.categoryId },
            }
            delete updateData.categoryId
        }
        const product = await this.productRepository.update(id, updateData)
        return mapProductToResponseDto(product)
    }
}
