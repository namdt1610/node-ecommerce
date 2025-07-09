'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    ShoppingCart,
    Search,
    Menu,
    User,
    LogOut,
    BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth, useAdmin } from '@/features/auth'

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { user, isAuthenticated, logout } = useAuth()
    const { hasAdminAccess } = useAdmin()

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
                        >
                            <Menu className="h-4 w-4" />
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
                                        <Button variant="ghost" className="flex items-center space-x-2 text-sm">
                                            <User className="h-4 w-4" />
                                            <span>
                                                {user?.firstName} {user?.lastName}
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
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-lg font-semibold mb-4">
                                ShopVite
                            </h4>
                            <p className="text-gray-400">
                                Nền tảng thương mại điện tử hàng đầu Việt Nam
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">
                                Về chúng tôi
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Giới thiệu
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Tuyển dụng
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Tin tức
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">
                                Hỗ trợ
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Trung tâm trợ giúp
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Liên hệ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Chính sách
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">
                                Theo dõi chúng tôi
                            </h4>
                            <div className="flex space-x-4">
                                <Button variant="ghost" size="icon">
                                    <span>FB</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <span>IG</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <span>TW</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 ShopVite. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
