import ProductCard from './product-card'
import { Product } from '@/shared/types'

interface ProductGridProps {
    products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Không tìm thấy sản phẩm nào
                </h2>
                <p className="text-gray-600 mb-4">
                    Thử điều chỉnh bộ lọc để xem thêm sản phẩm
                </p>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
