import { ProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface'

export class GetProductsCountUseCase {
    constructor(private productRepository: ProductRepositoryInterface) {}

    async execute(search?: string, categoryId?: string): Promise<number> {
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
        return this.productRepository.count(where)
    }
}
