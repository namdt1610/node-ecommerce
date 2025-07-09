import { ProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface'
import { ProductResponseDto } from '../../dto'
import { mapProductToResponseDto } from '../mappers/product.mapper'

export class GetAllProductsUseCase {
    constructor(private productRepository: ProductRepositoryInterface) {}

    async execute(params?: {
        skip?: number
        take?: number
        search?: string
        categoryId?: string
    }): Promise<ProductResponseDto[]> {
        const { skip, take, search, categoryId } = params || {}
        const where: any = {}
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        }
        if (categoryId) {
            where.categoryId = categoryId
        }
        const products = await this.productRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        })
        return products.map(mapProductToResponseDto)
    }
}
