import { ProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface'
import { Product } from '@prisma/client'

export class SearchProductsUseCase {
    constructor(private productRepository: ProductRepositoryInterface) {}

    async execute(searchOptions: any): Promise<{
        products: Product[]
        total: number
        hasMore: boolean
    }> {
        const { skip = 0, take = 10, search } = searchOptions

        const where: any = {}
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        }

        const products = await this.productRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        })

        const total = await this.productRepository.count(where)
        const hasMore = skip + take < total

        return {
            products,
            total,
            hasMore,
        }
    }
}
