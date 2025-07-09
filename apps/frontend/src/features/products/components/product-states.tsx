'use client'

import { Button } from '@/components/ui/button'
import { Layout } from '@/shared'

export default function ProductLoading() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                        <div className="grid grid-cols-4 gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square bg-gray-200 animate-pulse rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 animate-pulse rounded" />
                        <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export function ProductError() {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Không tìm thấy sản phẩm
                </h1>
                <Button onClick={() => window.history.back()}>Quay lại</Button>
            </div>
        </Layout>
    )
}
