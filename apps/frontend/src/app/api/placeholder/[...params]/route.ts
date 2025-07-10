import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ params: string[] }> }
) {
    const resolvedParams = await params
    const [width = '400', height = '400'] = resolvedParams.params

    // Parse dimensions
    const w = parseInt(width) || 400
    const h = parseInt(height) || 400

    // Create a simple SVG placeholder
    const svg = `
        <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(w, h) / 10}" fill="#9ca3af" text-anchor="middle" dy=".3em">
                ${w} × ${h}
            </text>
        </svg>
    `

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    })
}
