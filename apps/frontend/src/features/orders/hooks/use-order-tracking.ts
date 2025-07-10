'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'
import { orderApi } from '@/lib/api/orders'
import { Order, TrackingHistoryItem } from '@/shared/types'
import { createRetryConfig, createQueryKey, API_CONFIG } from '@/shared/utils'

export function useOrderTracking(orderId: string) {
    const [isConnected, setIsConnected] = useState(false)
    const [trackingHistory, setTrackingHistory] = useState<
        TrackingHistoryItem[]
    >([])
    const [socketError, setSocketError] = useState<string | null>(null)
    const socketRef = useRef<Socket | null>(null)
    const queryClient = useQueryClient()

    // Fetch initial order tracking data
    const {
        data: trackingData,
        isLoading,
        error,
    } = useQuery({
        queryKey: createQueryKey('order-tracking', orderId),
        queryFn: async () => {
            try {
                const response = await orderApi.getOrderTracking(orderId)
                console.log('Order tracking API response:', response.data)
                return response.data
            } catch (error) {
                console.error('Order tracking API error:', error)
                throw error
            }
        },
        enabled: !!orderId,
        ...createRetryConfig(),
    })

    const order: Order | undefined =
        trackingData?.data?.order || trackingData?.order

    // Initialize tracking history
    useEffect(() => {
        const initialHistory =
            trackingData?.data?.trackingHistory ||
            trackingData?.trackingHistory ||
            []
        if (initialHistory && initialHistory.length > 0) {
            setTrackingHistory(initialHistory)
        }
    }, [trackingData])

    // Socket.IO connection - auto connect when component mounts
    useEffect(() => {
        if (!orderId || !order?.id) {
            console.log('❌ Not connecting to socket - no orderId or order')
            return
        }

        const token = localStorage.getItem('token')
        if (!token) {
            console.log('❌ Not connecting to socket - no token')
            setSocketError('No authentication token found')
            return
        }

        console.log('🔌 Auto-connecting to WebSocket for order:', orderId)

        const socketUrl =
            process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
            'http://localhost:3030'
        console.log('📡 Socket URL:', socketUrl)

        // Clean up previous connection
        if (socketRef.current) {
            socketRef.current.disconnect()
        }

        socketRef.current = io(socketUrl, {
            auth: { token },
            transports: ['websocket'],
            timeout: API_CONFIG.SOCKET_TIMEOUT,
        })

        const socket = socketRef.current

        socket.on('connect', () => {
            console.log('✅ WebSocket auto-connected for order tracking')
            setIsConnected(true)
            setSocketError(null)

            // Join order-specific room
            socket.emit('join', `order-${orderId}`)
            console.log('🚪 Joined room: order-' + orderId)

            // Join user-specific room if we have userId
            if (order?.userId) {
                socket.emit('join', `user-${order.userId}`)
                console.log('🚪 Joined room: user-' + order.userId)
            }
        })

        socket.on('connect_error', (error) => {
            console.error('❌ WebSocket connection error:', error)
            setIsConnected(false)
            setSocketError(error.message || 'WebSocket connection failed')
        })

        socket.on('disconnect', (reason) => {
            console.log('📴 WebSocket disconnected:', reason)
            setIsConnected(false)
            if (reason === 'io server disconnect') {
                // Server disconnected, try to reconnect
                socket.connect()
            }
        })

        socket.on('order:tracking-update', (data) => {
            console.log('📦 Order tracking update received:', data)
            if (data.orderId === orderId) {
                setTrackingHistory(data.history || [])
                queryClient.invalidateQueries({
                    queryKey: createQueryKey('order-tracking', orderId),
                })
            }
        })

        socket.on('order:status-changed', (data) => {
            console.log('📋 Order status changed:', data)
            if (data.orderId === orderId) {
                queryClient.invalidateQueries({
                    queryKey: createQueryKey('order-tracking', orderId),
                })
            }
        })

        return () => {
            console.log('🧹 Cleaning up WebSocket connection')
            socket.disconnect()
        }
    }, [orderId, order?.id, order?.userId, queryClient])

    const startTracking = async () => {
        try {
            console.log('🔄 Refreshing order tracking data for:', orderId)

            // Trigger a manual refresh of data from server
            await orderApi.startOrderTracking(orderId)

            // Also invalidate queries to refetch fresh data
            queryClient.invalidateQueries({
                queryKey: createQueryKey('order-tracking', orderId),
            })

            console.log('✅ Order tracking data refreshed')
        } catch (error) {
            console.error('❌ Failed to refresh tracking data:', error)
            throw error
        }
    }

    return {
        order,
        trackingHistory,
        isLoading,
        error,
        isConnected,
        socketError,
        startTracking,
    }
}
