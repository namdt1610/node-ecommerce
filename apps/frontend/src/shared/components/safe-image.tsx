'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import {
    getSafeImageUrl,
    handleImageError,
    DEFAULT_PRODUCT_IMAGE,
    logger,
} from '@/shared/utils'

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
    src?: string | null
    fallback?: string
    className?: string
}

/**
 * SafeImage component that handles image loading errors gracefully
 * Automatically falls back to placeholder images when the source fails to load
 */
export function SafeImage({
    src,
    fallback = DEFAULT_PRODUCT_IMAGE,
    alt,
    className = '',
    ...props
}: SafeImageProps) {
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const imageUrl = hasError ? fallback : getSafeImageUrl(src, fallback)

    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        logger.image.error(src || 'unknown', fallback)
        setHasError(true)
        setIsLoading(false)
        handleImageError(event, fallback)
    }

    const handleLoad = () => {
        setIsLoading(false)
    }

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
            )}
            <Image
                {...props}
                src={imageUrl}
                alt={alt || 'Image'}
                onError={handleError}
                onLoad={handleLoad}
                className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            />
        </div>
    )
}

/**
 * ProductImage component specifically for product images with product-specific fallbacks
 * For use with explicit width and height
 */
export function ProductImage({
    src,
    alt,
    className = '',
    width = 400,
    height = 400,
    ...props
}: SafeImageProps & { width?: number; height?: number }) {
    return (
        <SafeImage
            src={src}
            alt={alt || 'Product image'}
            fallback={`https://placehold.co/${width}x${height}/EEE/999?text=Product+Image`}
            className={className}
            width={width}
            height={height}
            {...props}
        />
    )
}

/**
 * ProductImageFill component for use with fill prop (responsive containers)
 */
export function ProductImageFill({
    src,
    alt,
    className = '',
    ...props
}: SafeImageProps) {
    return (
        <SafeImage
            src={src}
            alt={alt || 'Product image'}
            fallback={`https://placehold.co/400x400/EEE/999?text=Product+Image`}
            className={className}
            fill
            {...props}
        />
    )
}

/**
 * AvatarImage component for user avatars
 */
export function AvatarImage({
    src,
    alt,
    className = '',
    size = 100,
    ...props
}: SafeImageProps & { size?: number }) {
    return (
        <SafeImage
            src={src}
            alt={alt || 'Avatar'}
            fallback={`https://placehold.co/${size}x${size}/EEE/999?text=Avatar`}
            className={`rounded-full ${className}`}
            width={size}
            height={size}
            {...props}
        />
    )
}

/**
 * CategoryImage component for category images
 */
export function CategoryImage({
    src,
    alt,
    className = '',
    width = 200,
    height = 200,
    ...props
}: SafeImageProps & { width?: number; height?: number }) {
    return (
        <SafeImage
            src={src}
            alt={alt || 'Category image'}
            fallback={`https://placehold.co/${width}x${height}/EEE/999?text=Category`}
            className={className}
            width={width}
            height={height}
            {...props}
        />
    )
}
