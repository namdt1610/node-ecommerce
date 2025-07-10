'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    ShoppingCart,
    Search,
    Menu,
    User,
    LogOut,
    BarChart3,
    Package,
    MapPin,
    X,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth, useAdmin } from '@/features/auth'
import { logger } from '@/shared/utils'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { Footer } from '@/features/home'

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { user, isAuthenticated, logout } = useAuth()
    const { hasAdminAccess } = useAdmin()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Debug auth state in development
    if (process.env.NODE_ENV === 'development') {
        logger.auth.tokenValidation(isAuthenticated, user?.id)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Menu className="h-4 w-4" />
                            )}
                        </Button>
                        <Link href="/" className="text-2xl font-bold">
                            ShopVite
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-md mx-8 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/products">
                                <Button variant="ghost">Sản phẩm</Button>
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link href="/orders">
                                        <Button variant="ghost">
                                            <Package className="h-4 w-4 mr-2" />
                                            Đơn hàng
                                        </Button>
                                    </Link>
                                    <Link href="/demo/order-tracking">
                                        <Button variant="ghost">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Theo dõi Demo
                                        </Button>
                                    </Link>
                                    {hasAdminAccess && (
                                        <Link href="/admin">
                                            <Button
                                                variant="ghost"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                Admin Dashboard
                                            </Button>
                                        </Link>
                                    )}
                                    <Link href="/profile">
                                        <Button
                                            variant="ghost"
                                            className="flex items-center space-x-2 text-sm"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>
                                                {user?.firstName}{' '}
                                                {user?.lastName}
                                            </span>
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" onClick={logout}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Đăng xuất
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost">
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button variant="ghost">Đăng ký</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                        <Link href="/cart">
                            <Button variant="outline" size="icon">
                                <ShoppingCart className="h-4 w-4" />
                            </Button>
                        </Link>
                    </nav>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t bg-background/95 backdrop-blur">
                        <div className="container mx-auto px-4 py-4 space-y-2">
                            <Link
                                href="/products"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    Sản phẩm
                                </Button>
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/orders"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            <Package className="h-4 w-4 mr-2" />
                                            Đơn hàng
                                        </Button>
                                    </Link>
                                    <Link
                                        href="/demo/order-tracking"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Theo dõi Demo
                                        </Button>
                                    </Link>
                                    {hasAdminAccess && (
                                        <Link
                                            href="/admin"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-blue-600 hover:text-blue-700"
                                            >
                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                Admin Dashboard
                                            </Button>
                                        </Link>
                                    )}
                                    <Link
                                        href="/profile"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            {user?.firstName} {user?.lastName}
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            logout()
                                            setIsMobileMenuOpen(false)
                                        }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Đăng xuất
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            Đăng ký
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-48 2xl:mx-auto max-w-screen-2xl">
                {children}
            </main>

            {/* Floating Action Button */}
            <FloatingActionButton />

            {/* Footer */}
            <Footer />
        </div>
    )
}
