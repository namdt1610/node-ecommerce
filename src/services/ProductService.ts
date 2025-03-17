import { uowWrapper } from '@/utils/uowWrapper'

export class ProductService {
    async createProduct(productData: {
        name: string
        description: string
        price: number
        stock: number
        category: string
        images?: string[]
    }) {
        return uowWrapper(async (uow) => {
            const product = await uow.productRepository.create(productData)
            return product
        })
    }

    async getProducts() {
        return uowWrapper(async (uow) => {
            const products = await uow.productRepository.findAll()
            return products
        })
    }

    async getActiveProducts() {
        return uowWrapper(async (uow) => {
            const products = await uow.productRepository.findAll({
                isActive: true,
            })
            return products
        })
    }

    async getProductById(productId: string) {
        return uowWrapper(async (uow) => {
            const product = await uow.productRepository.findById(productId)
            if (!product) throw new ProductError('Product not found', 404)
            return product
        })
    }

    async updateProduct(
        productId: string,
        updateData: Partial<{
            name: string
            description: string
            price: number
            stock: number
            category: string
            images: string[]
            clickCount: number
            isActive: boolean
        }>
    ) {
        return uowWrapper(async (uow) => {
            const product = await uow.productRepository.findById(productId)
            if (!product) throw new ProductError('Product not found', 404)

            const updatedProduct = await uow.productRepository.update(
                productId,
                updateData
            )
            return updatedProduct
        })
    }

    async deleteProduct(productId: string) {
        return uowWrapper(async (uow) => {
            const product = await uow.productRepository.findById(productId)
            if (!product) throw new ProductError('Product not found', 404)

            await uow.productRepository.delete(productId)
            return { message: 'Product deleted successfully' }
        })
    }
}

class ProductError extends Error {
    statusCode: number

    constructor(message: string, statusCode = 400) {
        super(message)
        this.name = 'ProductError'
        this.statusCode = statusCode

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ProductError)
        }
    }
}

export default new ProductService()
