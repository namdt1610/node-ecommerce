'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star } from 'lucide-react'
import { Product } from '@/shared/types'

interface ProductTabsProps {
    product: Product
}

export default function ProductTabs({ product }: ProductTabsProps) {
    return (
        <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">
                        Mô tả sản phẩm
                    </TabsTrigger>
                    <TabsTrigger value="specifications">
                        Thông số kỹ thuật
                    </TabsTrigger>
                    <TabsTrigger value="reviews">Đánh giá (128)</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="prose max-w-none">
                                <p>
                                    {product.description ||
                                        'Chưa có mô tả sản phẩm.'}
                                </p>
                                <h4>Đặc điểm nổi bật:</h4>
                                <ul>
                                    <li>Chất lượng cao, độ bền tốt</li>
                                    <li>Thiết kế hiện đại, tinh tế</li>
                                    <li>Phù hợp cho mọi lứa tuổi</li>
                                    <li>Dễ sử dụng và bảo quản</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Thông tin chung
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Thương hiệu:</span>
                                            <span>ShopVite</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Xuất xứ:</span>
                                            <span>Việt Nam</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Bảo hành:</span>
                                            <span>12 tháng</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Kích thước
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Chiều dài:</span>
                                            <span>20 cm</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Chiều rộng:</span>
                                            <span>15 cm</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Trọng lượng:</span>
                                            <span>500g</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-semibold">
                                            Đánh giá từ khách hàng
                                        </h4>
                                        <div className="flex items-center mt-2">
                                            <div className="flex items-center">
                                                {Array.from({ length: 5 }).map(
                                                    (_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${
                                                                i < 4
                                                                    ? 'text-yellow-400 fill-current'
                                                                    : 'text-gray-300'
                                                            }`}
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <span className="ml-2 font-medium">
                                                4.5 trên 5
                                            </span>
                                            <span className="ml-2 text-sm text-muted-foreground">
                                                (128 đánh giá)
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="outline">
                                        Viết đánh giá
                                    </Button>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="border-b pb-4 last:border-b-0"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                                                    <span className="font-medium">
                                                        Khách hàng {i + 1}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    {Array.from({
                                                        length: 5,
                                                    }).map((_, j) => (
                                                        <Star
                                                            key={j}
                                                            className={`h-3 w-3 ${
                                                                j <
                                                                (i === 0
                                                                    ? 5
                                                                    : i === 1
                                                                      ? 4
                                                                      : 3)
                                                                    ? 'text-yellow-400 fill-current'
                                                                    : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Sản phẩm rất tốt, chất lượng như
                                                mô tả. Giao hàng nhanh, đóng gói
                                                cẩn thận.
                                                {i === 0 &&
                                                    ' Rất hài lòng với lần mua hàng này, sẽ tiếp tục ủng hộ shop.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
