import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

import { Category } from '@/shared/types'

interface CategoriesSectionProps {
    categories: Category[]
    isLoading: boolean
}

export function CategoriesSection({
    categories,
    isLoading,
}: CategoriesSectionProps) {
    const fallbackCategories = ['Điện tử', 'Thời trang', 'Nhà cửa', 'Thể thao']

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center mb-12">
                    Danh mục sản phẩm
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {isLoading
                        ? // Loading skeleton
                          Array.from({ length: 4 }).map((_, i) => (
                              <Card key={i} className="animate-pulse">
                                  <CardContent className="p-6 text-center">
                                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                                  </CardContent>
                              </Card>
                          ))
                        : categories?.length > 0
                          ? categories.slice(0, 4).map((category: Category) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.id}`}
                                >
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <ShoppingCart className="h-8 w-8 text-primary" />
                                            </div>
                                            <h4 className="font-semibold">
                                                {category.name}
                                            </h4>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                          : // Fallback categories
                            fallbackCategories.map((category) => (
                                <Card
                                    key={category}
                                    className="hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <ShoppingCart className="h-8 w-8 text-primary" />
                                        </div>
                                        <h4 className="font-semibold">
                                            {category}
                                        </h4>
                                    </CardContent>
                                </Card>
                            ))}
                </div>
            </div>
        </section>
    )
}
