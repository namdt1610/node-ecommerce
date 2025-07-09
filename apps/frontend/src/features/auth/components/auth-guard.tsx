'use client'

import { ReactNode } from 'react'
import { useAuth } from '../providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ROUTES } from '@/shared/constants'

interface AuthGuardProps {
    children: ReactNode
    redirectTo?: string
    requireAuth?: boolean
}

export function AuthGuard({
    children,
    redirectTo = ROUTES.LOGIN,
    requireAuth = true,
}: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !isAuthenticated) {
                router.push(redirectTo)
            } else if (!requireAuth && isAuthenticated) {
                router.push(ROUTES.HOME)
            }
        }
    }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (requireAuth && !isAuthenticated) {
        return null
    }

    if (!requireAuth && isAuthenticated) {
        return null
    }

    return <>{children}</>
}
