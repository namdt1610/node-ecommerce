import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'loremflickr.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'dummyimage.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3030',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'store.storeimages.cdn-apple.com',
                port: '',
                pathname: '/**',
            },
        ],
        // Allow dangerouslyAllowSVG for placeholder images
        dangerouslyAllowSVG: true,
        // Content security policy for images
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        // Image optimization settings
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp'],
    },
    // Disable strict mode to avoid double API calls in development
    reactStrictMode: false,
}

export default nextConfig
