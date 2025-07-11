'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { SocketData } from '@/shared/types'

export const useSocket = (enabled: boolean = true) => {
    const [isConnected, setIsConnected] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const socketRef = useRef<Socket | null>(null)
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!enabled) return

        const token = localStorage.getItem('token')
        if (!token) return

        const socketUrl =
            process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
            'http://localhost:3030'

        socketRef.current = io(socketUrl, {
            auth: { token },
            transports: ['websocket'],
            forceNew: true,
        })

        const socket = socketRef.current

        // Connection events
        socket.on('connect', () => {
            console.log('🔌 Dashboard socket connected')
            setIsConnected(true)
            setConnectionError(null)
        })

        socket.on('connect_error', (error) => {
            console.error('🚨 Dashboard socket connection error:', error)
            setIsConnected(false)
            setConnectionError(error.message)
        })

        socket.on('disconnect', () => {
            console.log('📴 Dashboard socket disconnected')
            setIsConnected(false)
        })

        // Dashboard events
        socket.on('dashboard:connected', (data) => {
            console.log('✅ Dashboard connected:', data.message)
        })

        socket.on('dashboard:stats-update', (data: SocketData) => {
            console.log('📊 Stats update received:', data)
            // Don't invalidate queries to prevent re-render loop
        })

        socket.on('dashboard:sales-update', (data: SocketData) => {
            console.log('💰 Sales update received:', data)
            // Don't invalidate queries to prevent re-render loop
        })

        socket.on('dashboard:users-update', (data: SocketData) => {
            console.log('👥 Users update received:', data)
            // Don't invalidate queries to prevent re-render loop
        })

        socket.on('dashboard:products-update', (data: SocketData) => {
            console.log('📦 Products update received:', data)
            queryClient.invalidateQueries({
                queryKey: ['dashboard', 'products'],
            })
        })

        socket.on('dashboard:activity-update', (data: SocketData) => {
            console.log('🔔 Activity update received:', data)
            queryClient.invalidateQueries({
                queryKey: ['dashboard', 'activity'],
            })
        })

        socket.on('dashboard:update', (data: SocketData) => {
            console.log('🔄 Full dashboard update received:', data)
            // Don't invalidate all queries to prevent re-render loop
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [enabled, queryClient])

    const requestStats = () => {
        socketRef.current?.emit('dashboard:request-stats')
    }

    const requestSales = (days?: number) => {
        socketRef.current?.emit('dashboard:request-sales', { days })
    }

    const requestUsers = () => {
        socketRef.current?.emit('dashboard:request-users')
    }

    const requestProducts = () => {
        socketRef.current?.emit('dashboard:request-products')
    }

    const requestActivity = () => {
        socketRef.current?.emit('dashboard:request-activity')
    }

    return {
        isConnected,
        connectionError,
        requestStats,
        requestSales,
        requestUsers,
        requestProducts,
        requestActivity,
    }
}
