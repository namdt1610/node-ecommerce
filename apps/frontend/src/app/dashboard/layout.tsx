'use client'

import { useAuth, useAdmin } from '@/features/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, AlertTriangle } from 'lucide-react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, isLoading } = useAuth()
    const { userRole, canAccessDashboard } = useAdmin()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Unauthorized Access
                            </h2>
                            <p className="text-gray-600">
                                Bạn cần đăng nhập để truy cập trang này.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!canAccessDashboard) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Shield className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Admin Access Required
                            </h2>
                            <p className="text-gray-600">
                                Bạn không có quyền truy cập vào dashboard này.
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Role hiện tại: {userRole || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Chỉ có admin mới được truy cập dashboard này.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Layout được handle trong DashboardPage feature
    return <>{children}</>
}
