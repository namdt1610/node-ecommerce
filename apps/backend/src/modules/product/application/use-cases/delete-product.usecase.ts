import { ProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface'

export class DeleteProductUseCase {
    constructor(private productRepository: ProductRepositoryInterface) {}

    async execute(id: string): Promise<void> {
        await this.productRepository.delete(id)
    }
}
