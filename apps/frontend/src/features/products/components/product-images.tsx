'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImagesProps {
    productName: string
    images?: string[]
}

export default function ProductImages({
    productName,
    images,
}: ProductImagesProps) {
    const [selectedImage, setSelectedImage] = useState(0)

    const defaultImages = [
        '/api/placeholder/600/600',
        '/api/placeholder/600/600',
        '/api/placeholder/600/600',
        '/api/placeholder/600/600',
    ]

    const displayImages = images || defaultImages

    return (
        <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <Image
                    src={displayImages[selectedImage]}
                    alt={productName}
                    fill
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="grid grid-cols-4 gap-2">
                {displayImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 ${
                            selectedImage === index
                                ? 'border-primary'
                                : 'border-transparent'
                        }`}
                    >
                        <Image
                            src={image}
                            alt={`${productName} ${index + 1}`}
                            fill
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
