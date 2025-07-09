import { ProductResponseDto } from '../../dto'

export function mapProductToResponseDto(product: any): ProductResponseDto {
    const images = product.images ? JSON.parse(product.images as string) : []
    const imageUrl = images.length > 0 ? images[0] : undefined

    // Parse variants from JSON if it exists
    const variants = product.variants
        ? typeof product.variants === 'string'
            ? JSON.parse(product.variants)
            : product.variants
        : []

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || undefined,
        price: product.price,
        originalPrice: product.originalPrice || undefined,
        imageUrl,
        variants,
        category: {
            id: product.category.id,
            name: product.category.name,
        },
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    }
}
