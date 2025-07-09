'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useCallback } from 'react'
import { userApi } from '@/lib/api'

export const useAuthProfile = () => {
    const [token, setToken] = useState<string | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token')

            // Check if token is valid before using it
            if (storedToken && isTokenValid(storedToken)) {
                console.log('🔍 AuthProfile: Valid token found')
                setToken(storedToken)
            } else if (storedToken) {
                console.log(
                    '🔍 AuthProfile: Invalid/expired token found, clearing...'
                )
                localStorage.removeItem('token')
                setToken(null)
            } else {
                console.log('🔍 AuthProfile: No token found')
                setToken(null)
            }

            setIsInitialized(true)
        }
    }, [])

    const profileQuery = useQuery({
        queryKey: ['profile', token],
        queryFn: async () => {
            console.log('🔍 AuthProfile: Making profile API call...')
            try {
                const response = await userApi.getProfile()
                console.log(
                    '✅ AuthProfile: Profile API success:',
                    response.data
                )
                return response
            } catch (error) {
                console.log('❌ AuthProfile: Profile API error:', error)
                throw error
            }
        },
        select: (data) => data.data,
        retry: (failureCount, error: unknown) => {
            // Don't retry on 401 errors (unauthorized)
            if (
                (error as { response?: { status: number } })?.response
                    ?.status === 401
            ) {
                return false
            }
            return failureCount < 3
        },
        enabled: !!token && isInitialized,
    })

    // Helper function to check if token is valid (not expired)
    const isTokenValid = (token: string | null): boolean => {
        if (!token) return false

        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const now = Date.now() / 1000
            return payload.exp > now
        } catch (error) {
            console.log('🚨 Token validation error:', error)
            return false
        }
    }

    const updateToken = useCallback((newToken: string | null) => {
        console.log(
            '🔄 AuthProfile: Updating token:',
            newToken ? 'TOKEN_SET' : 'TOKEN_REMOVED'
        )

        if (newToken) {
            // Validate token before setting
            if (isTokenValid(newToken)) {
                setToken(newToken)
                localStorage.setItem('token', newToken)
            } else {
                console.log('🚨 AuthProfile: Attempted to set invalid token')
                setToken(null)
                localStorage.removeItem('token')
            }
        } else {
            setToken(null)
            localStorage.removeItem('token')
        }
    }, [])

    // Clear token if profile fetch fails with 401
    useEffect(() => {
        if (
            profileQuery.error &&
            (profileQuery.error as { response?: { status: number } })?.response
                ?.status === 401
        ) {
            console.log('🚨 AuthProfile: Token invalid, clearing...')
            updateToken(null)
        }
    }, [profileQuery.error, updateToken])

    return {
        ...profileQuery,
        token,
        updateToken,
        isInitialized,
    }
}
