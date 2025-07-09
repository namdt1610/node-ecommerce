'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useAuthProfile } from '../hooks/use-auth-profile'

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
        console.log('🔐 AuthProvider State:', {
            hasToken: !!token,
            hasUser: !!user,
            hasError: !!error,
            errorMessage: error instanceof Error ? error.message : String(error),
            isInitialized,
            isAuthenticated,
            isLoading,
            profileLoading,
        })
    }, [
        token,
        user,
        error,
        isInitialized,
        isAuthenticated,
        isLoading,
        profileLoading,
    ])

    const login = (newToken: string) => {
        console.log('🔐 AuthProvider: Login called with token')
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
            console.log('Logout API call failed:', error)
        } finally {
            // Always clear local token regardless of API call result
            updateToken(null)
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
