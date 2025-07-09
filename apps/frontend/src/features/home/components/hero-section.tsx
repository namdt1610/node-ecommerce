import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-5xl font-bold mb-4">
                    Chào mừng đến với ShopVite
                </h2>
                <p className="text-xl mb-8">
                    Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
                </p>
                <Link href="/products">
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100"
                    >
                        Khám phá ngay
                    </Button>
                </Link>
            </div>
        </section>
    )
}
