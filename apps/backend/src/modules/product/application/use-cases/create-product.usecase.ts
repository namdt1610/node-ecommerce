import { ProductRepositoryInterface } from '../../domain/interfaces/product.repository.interface'
import { CreateProductDto } from '../../dto/create-product.dto'
import { Product } from '@prisma/client'

export class CreateProductUseCase {
    constructor(private productRepository: ProductRepositoryInterface) {}

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    async execute(createProductDto: CreateProductDto): Promise<Product> {
        const slug = this.generateSlug(createProductDto.name)

        // Check if slug already exists
        const existingSlug = await this.productRepository.findBySlug(slug)
        if (existingSlug) {
            throw new Error('Product with similar name already exists')
        }

        const product = await this.productRepository.create({
            ...createProductDto,
            slug,
        })

        return product
    }
}
