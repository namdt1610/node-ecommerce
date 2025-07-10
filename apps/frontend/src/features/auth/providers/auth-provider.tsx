'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useAuthProfile } from '../hooks/use-auth-profile'
import { useToast, logger } from '@/shared'

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (token: string) => void
    logout: () => void
    refetch: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { success } = useToast()

    // Use the auth profile hook that handles token state
    const {
        data: user,
        isLoading: profileLoading,
        error,
        refetch,
        token,
        updateToken,
        isInitialized,
    } = useAuthProfile()

    // Check if user is authenticated
    const isAuthenticated = !!token && !!user && !error && isInitialized
    const isLoading = !isInitialized || (!!token && profileLoading)

    // Debug logging
    useEffect(() => {
        if (token && user) {
            logger.auth.profileLoad(user.id)
        } else if (error) {
            logger.auth.profileError(error, user?.id)
        }
    }, [token, user, error])

    const login = (newToken: string) => {
        logger.auth.login()
        updateToken(newToken)
        // Refetch profile after login
        setTimeout(() => {
            refetch()
        }, 100)
    }

    const logout = async () => {
        try {
            // Call logout API to clear server-side session/cookies
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies
            })
        } catch (error) {
            logger.auth.loginError(error)
        } finally {
            // Always clear local token regardless of API call result
            updateToken(null)
            logger.auth.logout(user?.id)
            success.logout()
            window.location.href = '/'
        }
    }

    const value: AuthContextType = {
        user: user || null,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refetch,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
