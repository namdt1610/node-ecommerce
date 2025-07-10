/**
 * Image utility functions for handling product images safely
 */

// Default placeholder images
export const DEFAULT_PRODUCT_IMAGE = '/api/placeholder/400/400'
export const DEFAULT_AVATAR_IMAGE = '/api/placeholder/100/100'
export const DEFAULT_CATEGORY_IMAGE = '/api/placeholder/200/200'

/**
 * Get a safe image URL with fallback
 * @param imageUrl - The original image URL
 * @param fallback - The fallback image URL (defaults to DEFAULT_PRODUCT_IMAGE)
 * @returns A safe image URL
 */
export function getSafeImageUrl(
    imageUrl?: string | null,
    fallback: string = DEFAULT_PRODUCT_IMAGE
): string {
    if (!imageUrl) {
        return fallback
    }

    // If it's a relative path that starts with /uploads/, make sure it exists
    if (imageUrl.startsWith('/uploads/')) {
        // For now, return the URL as-is. In production, you might want to check if the file exists
        return imageUrl
    }

    // If it's an external URL (starts with http/https), return as-is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl
    }

    // If it's an API placeholder or other internal route, return as-is
    if (imageUrl.startsWith('/api/') || imageUrl.startsWith('/')) {
        return imageUrl
    }

    // For any other case, use fallback
    return fallback
}

/**
 * Get multiple safe image URLs from an array
 * @param images - Array of image URLs
 * @param fallback - The fallback image URL
 * @returns Array of safe image URLs
 */
export function getSafeImageUrls(
    images?: string[] | null,
    fallback: string = DEFAULT_PRODUCT_IMAGE
): string[] {
    if (!images || images.length === 0) {
        return [fallback]
    }

    return images.map((image) => getSafeImageUrl(image, fallback))
}

/**
 * Get a product image URL with product-specific fallback
 * @param product - Product object with imageUrl and images
 * @returns A safe product image URL
 */
export function getProductImageUrl(product: {
    imageUrl?: string
    images?: string[]
}): string {
    // Try imageUrl first
    if (product.imageUrl) {
        return getSafeImageUrl(product.imageUrl)
    }

    // Try first image from images array
    if (product.images && product.images.length > 0) {
        return getSafeImageUrl(product.images[0])
    }

    // Return default product image
    return DEFAULT_PRODUCT_IMAGE
}

/**
 * Get all product images with fallback
 * @param product - Product object with imageUrl and images
 * @returns Array of safe product image URLs
 */
export function getProductImages(product: {
    imageUrl?: string
    images?: string[]
}): string[] {
    const allImages: string[] = []

    // Add imageUrl if exists
    if (product.imageUrl) {
        allImages.push(product.imageUrl)
    }

    // Add other images if exists
    if (product.images && product.images.length > 0) {
        allImages.push(...product.images)
    }

    // If no images, return default
    if (allImages.length === 0) {
        return [DEFAULT_PRODUCT_IMAGE]
    }

    // Return safe URLs
    return allImages.map((image) => getSafeImageUrl(image))
}

/**
 * Create a placeholder image URL for development
 * @param width - Image width
 * @param height - Image height
 * @param text - Text to display on placeholder
 * @returns Placeholder image URL
 */
export function createPlaceholderUrl(
    width: number = 400,
    height: number = 400,
    text?: string
): string {
    const baseUrl = `https://placehold.co/${width}x${height}`

    if (text) {
        const encodedText = encodeURIComponent(text)
        return `${baseUrl}/EEE/999?text=${encodedText}`
    }

    return `${baseUrl}/EEE/999`
}

/**
 * Handle image loading errors
 * @param event - Image error event
 * @param fallbackUrl - Fallback image URL
 */
export function handleImageError(
    event: React.SyntheticEvent<HTMLImageElement>,
    fallbackUrl: string = DEFAULT_PRODUCT_IMAGE
): void {
    const target = event.target as HTMLImageElement
    if (target.src !== fallbackUrl) {
        target.src = fallbackUrl
    }
}

/**
 * Optimize image URL for different sizes
 * @param imageUrl - Original image URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
    imageUrl: string,
    width?: number,
    height?: number
): string {
    // For external URLs that support size parameters (like placeholder services)
    if (imageUrl.includes('placehold.co') && width && height) {
        return imageUrl.replace(/\/\d+x\d+/, `/${width}x${height}`)
    }

    if (imageUrl.includes('api/placeholder') && width && height) {
        return imageUrl.replace(/\/\d+\/\d+/, `/${width}/${height}`)
    }

    // For local images, return as-is (Next.js will handle optimization)
    return imageUrl
}
