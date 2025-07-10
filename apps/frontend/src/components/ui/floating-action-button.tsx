'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Package, MapPin, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth'

export function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false)
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) return null

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Action Menu */}
            {isOpen && (
                <div className="mb-4 space-y-2">
                    <Link href="/orders">
                        <Button
                            size="sm"
                            className="w-full shadow-lg"
                            onClick={() => setIsOpen(false)}
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Đơn hàng
                        </Button>
                    </Link>
                    <Link href="/demo/order-tracking">
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full shadow-lg bg-background"
                            onClick={() => setIsOpen(false)}
                        >
                            <MapPin className="h-4 w-4 mr-2" />
                            Demo Tracking
                        </Button>
                    </Link>
                </div>
            )}

            {/* Main FAB */}
            <Button
                size="icon"
                className={cn(
                    'h-14 w-14 rounded-full shadow-lg transition-all duration-200',
                    isOpen && 'rotate-45'
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Package className="h-6 w-6" />
                )}
            </Button>
        </div>
    )
}
