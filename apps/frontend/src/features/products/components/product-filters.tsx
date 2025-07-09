import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Category {
    id: string
    name: string
    description?: string
    imageUrl?: string
}

type SortOption =
    | 'name-asc'
    | 'name-desc'
    | 'price-asc'
    | 'price-desc'
    | 'newest'
    | 'oldest'

interface ProductFiltersProps {
    searchTerm: string
    setSearchTerm: (v: string) => void
    selectedCategory: string
    setSelectedCategory: (v: string) => void
    categories: Category[]
    priceRange: [number, number]
    setPriceRange: (v: [number, number]) => void
    allProducts: { price: number }[]
    sortBy: SortOption
    setSortBy: (v: SortOption) => void
    clearFilters: () => void
}

export default function ProductFilters({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
    priceRange,
    setPriceRange,
    allProducts,
    sortBy,
    setSortBy,
    clearFilters,
}: ProductFiltersProps) {
    return (
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tìm kiếm
                        </label>
                        <Input
                            type="text"
                            placeholder="Tìm tên sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danh mục
                        </label>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tất cả danh mục
                                </SelectItem>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sắp xếp
                        </label>
                        <Select
                            value={sortBy}
                            onValueChange={(value: string) =>
                                setSortBy(value as SortOption)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Mới nhất</SelectItem>
                                <SelectItem value="oldest">Cũ nhất</SelectItem>
                                <SelectItem value="name-asc">
                                    Tên A-Z
                                </SelectItem>
                                <SelectItem value="name-desc">
                                    Tên Z-A
                                </SelectItem>
                                <SelectItem value="price-asc">
                                    Giá thấp đến cao
                                </SelectItem>
                                <SelectItem value="price-desc">
                                    Giá cao đến thấp
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Clear Filters */}
                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="w-full flex items-center gap-2"
                        >
                            <X className="w-4 h-4" /> Xóa bộ lọc
                        </Button>
                    </div>
                </div>
                {/* Price Range */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khoảng giá: {priceRange[0].toLocaleString('vi-VN')} -{' '}
                        {priceRange[1].toLocaleString('vi-VN')}
                    </label>
                    <Slider
                        value={priceRange}
                        onValueChange={(v) =>
                            setPriceRange(v as [number, number])
                        }
                        max={Math.max(...allProducts.map((p) => p.price), 0)}
                        min={Math.min(...allProducts.map((p) => p.price), 0)}
                        step={10000}
                        className="w-full"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
