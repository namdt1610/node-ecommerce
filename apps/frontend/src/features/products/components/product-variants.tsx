'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/shared/utils'

interface VariantAttribute {
    name: string
    value: string
}

interface ProductVariant {
    id: string
    name: string
    sku: string
    price?: number
    originalPrice?: number
    attributes: VariantAttribute[]
    images?: string[]
    inventory: {
        quantity: number
        reservedQuantity: number
        availableQuantity: number
        lowStockThreshold: number
    }
    isActive: boolean
}

interface ProductVariantsProps {
    variants: ProductVariant[]
    basePrice: number
    baseOriginalPrice?: number
    onVariantChange?: (variant: ProductVariant | null) => void
    className?: string
}

const ProductVariants = ({
    variants,
    basePrice,
    baseOriginalPrice,
    onVariantChange,
    className = '',
}: ProductVariantsProps) => {
    const [selectedVariant, setSelectedVariant] =
        useState<ProductVariant | null>(null)
    const [selectedColor, setSelectedColor] = useState<string>('')
    const [selectedStorage, setSelectedStorage] = useState<string>('')

    // Extract unique colors and storages
    const colors = [
        ...new Set(
            variants.flatMap((v) =>
                v.attributes
                    .filter((attr) => attr.name === 'Color')
                    .map((attr) => attr.value)
            )
        ),
    ]

    const storages = [
        ...new Set(
            variants.flatMap((v) =>
                v.attributes
                    .filter((attr) => attr.name === 'Storage')
                    .map((attr) => attr.value)
            )
        ),
    ]

    // Find variant based on selected attributes
    useEffect(() => {
        if (selectedColor && selectedStorage) {
            const variant = variants.find(
                (v) =>
                    v.attributes.some(
                        (attr) =>
                            attr.name === 'Color' &&
                            attr.value === selectedColor
                    ) &&
                    v.attributes.some(
                        (attr) =>
                            attr.name === 'Storage' &&
                            attr.value === selectedStorage
                    )
            )
            setSelectedVariant(variant || null)
            onVariantChange?.(variant || null)
        } else {
            setSelectedVariant(null)
            onVariantChange?.(null)
        }
    }, [selectedColor, selectedStorage, variants, onVariantChange])

    const getCurrentPrice = () => {
        return selectedVariant?.price || basePrice
    }

    const getCurrentOriginalPrice = () => {
        return selectedVariant?.originalPrice || baseOriginalPrice || basePrice
    }

    const getColorDisplayName = (color: string) => {
        const colorMap: { [key: string]: string } = {
            'Space Gray': 'Xám',
            Silver: 'Bạc',
            Gold: 'Vàng',
            'Rose Gold': 'Vàng Hồng',
            Black: 'Đen',
            White: 'Trắng',
            Red: 'Đỏ',
            Blue: 'Xanh Dương',
            Green: 'Xanh Lá',
            Purple: 'Tím',
            Pink: 'Hồng',
            Yellow: 'Vàng',
            Midnight: 'Đen Đậm',
            Starlight: 'Ánh Sao',
            'Pacific Blue': 'Xanh Thái Bình Dương',
            Graphite: 'Than Chì',
            'Sierra Blue': 'Xanh Sierra',
            'Alpine Green': 'Xanh Alpine',
            'Deep Purple': 'Tím Đậm',
            'Natural Titanium': 'Titan Tự Nhiên',
            'Blue Titanium': 'Titan Xanh',
            'White Titanium': 'Titan Trắng',
            'Black Titanium': 'Titan Đen',
        }
        return colorMap[color] || color
    }

    const getColorClass = (color: string) => {
        const colorClasses: { [key: string]: string } = {
            'Space Gray': 'bg-gray-600',
            Silver: 'bg-gray-300',
            Gold: 'bg-yellow-400',
            'Rose Gold': 'bg-pink-300',
            Black: 'bg-black',
            White: 'bg-white border-2 border-gray-200',
            Red: 'bg-red-500',
            Blue: 'bg-blue-500',
            Green: 'bg-green-500',
            Purple: 'bg-purple-500',
            Pink: 'bg-pink-400',
            Yellow: 'bg-yellow-400',
            Midnight: 'bg-gray-900',
            Starlight: 'bg-yellow-100 border-2 border-gray-200',
            'Pacific Blue': 'bg-blue-600',
            Graphite: 'bg-gray-700',
            'Sierra Blue': 'bg-blue-400',
            'Alpine Green': 'bg-green-600',
            'Deep Purple': 'bg-purple-700',
            'Natural Titanium': 'bg-gray-400',
            'Blue Titanium': 'bg-blue-400',
            'White Titanium': 'bg-gray-200',
            'Black Titanium': 'bg-gray-800',
        }
        return colorClasses[color] || 'bg-gray-400'
    }

    const isVariantAvailable = (color: string, storage: string) => {
        const variant = variants.find(
            (v) =>
                v.attributes.some(
                    (attr) => attr.name === 'Color' && attr.value === color
                ) &&
                v.attributes.some(
                    (attr) => attr.name === 'Storage' && attr.value === storage
                )
        )
        return (
            variant &&
            variant.isActive &&
            variant.inventory.availableQuantity > 0
        )
    }

    const getVariantStock = (color: string, storage: string) => {
        const variant = variants.find(
            (v) =>
                v.attributes.some(
                    (attr) => attr.name === 'Color' && attr.value === color
                ) &&
                v.attributes.some(
                    (attr) => attr.name === 'Storage' && attr.value === storage
                )
        )
        return variant?.inventory.availableQuantity || 0
    }

    if (!variants || variants.length === 0) {
        return null
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Price Display */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-red-600">
                        {formatPrice(getCurrentPrice())}
                    </span>
                    {getCurrentOriginalPrice() > getCurrentPrice() && (
                        <span className="text-lg text-gray-500 line-through">
                            {formatPrice(getCurrentOriginalPrice())}
                        </span>
                    )}
                </div>
                {selectedVariant && (
                    <div className="text-sm text-gray-600">
                        SKU: {selectedVariant.sku}
                    </div>
                )}
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
                <div className="space-y-3">
                    <div className="font-medium">
                        Màu sắc:{' '}
                        {selectedColor && (
                            <span className="font-normal text-gray-600">
                                {getColorDisplayName(selectedColor)}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`
                  relative w-10 h-10 rounded-full border-2 transition-all
                  ${
                      selectedColor === color
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-gray-400'
                  }
                  ${getColorClass(color)}
                `}
                                title={getColorDisplayName(color)}
                            >
                                {selectedColor === color && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Storage Selection */}
            {storages.length > 0 && (
                <div className="space-y-3">
                    <div className="font-medium">
                        Dung lượng:{' '}
                        {selectedStorage && (
                            <span className="font-normal text-gray-600">
                                {selectedStorage}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {storages.map((storage) => {
                            const isAvailable = selectedColor
                                ? isVariantAvailable(selectedColor, storage)
                                : true
                            const stock = selectedColor
                                ? getVariantStock(selectedColor, storage)
                                : 0

                            return (
                                <Button
                                    key={storage}
                                    variant={
                                        selectedStorage === storage
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => setSelectedStorage(storage)}
                                    disabled={!isAvailable}
                                    className={`
                    relative
                    ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                                >
                                    {storage}
                                    {selectedColor &&
                                        stock <= 5 &&
                                        stock > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="absolute -top-2 -right-2 text-xs px-1"
                                            >
                                                {stock}
                                            </Badge>
                                        )}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Stock Status */}
            {selectedVariant && (
                <div className="space-y-2">
                    {selectedVariant.inventory.availableQuantity > 0 ? (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600">
                                Còn hàng (
                                {selectedVariant.inventory.availableQuantity}{' '}
                                sản phẩm)
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-red-600">
                                Hết hàng
                            </span>
                        </div>
                    )}

                    {selectedVariant.inventory.availableQuantity <=
                        selectedVariant.inventory.lowStockThreshold &&
                        selectedVariant.inventory.availableQuantity > 0 && (
                            <div className="text-sm text-orange-600">
                                ⚠️ Chỉ còn ít hàng
                            </div>
                        )}
                </div>
            )}

            {/* Selection Status */}
            {(!selectedColor || !selectedStorage) && (
                <div className="text-sm text-gray-500">
                    Vui lòng chọn {!selectedColor && 'màu sắc'}{' '}
                    {!selectedColor && !selectedStorage && 'và '}{' '}
                    {!selectedStorage && 'dung lượng'}
                </div>
            )}
        </div>
    )
}

export default ProductVariants
