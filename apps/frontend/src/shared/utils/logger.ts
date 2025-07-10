/**
 * Comprehensive Logging Utility
 * Provides structured, usecase-specific logging with consistent formatting
 * Follows DRY principles and improves debugging experience
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
export type UseCase =
    | 'auth'
    | 'cart'
    | 'order'
    | 'product'
    | 'api'
    | 'socket'
    | 'image'
    | 'payment'
    | 'navigation'
    | 'form'

interface LogContext {
    useCase: UseCase
    action?: string
    userId?: string
    metadata?: Record<string, unknown>
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development'

    private formatMessage(
        level: LogLevel,
        context: LogContext,
        message: string,
        data?: unknown
    ): void {
        if (!this.isDevelopment && level === 'debug') return

        const emoji = this.getEmoji(context.useCase, level)
        const prefix = `${emoji} [${level.toUpperCase()}] ${context.useCase.toUpperCase()}`
        const action = context.action ? ` → ${context.action}` : ''
        const user = context.userId ? ` (User: ${context.userId})` : ''

        const formattedMessage = `${prefix}${action}${user}: ${message}`

        switch (level) {
            case 'debug':
            case 'info':
                console.log(formattedMessage, data ? data : '')
                break
            case 'warn':
                console.warn(formattedMessage, data ? data : '')
                break
            case 'error':
                console.error(formattedMessage, data ? data : '')
                break
        }
    }

    private getEmoji(useCase: UseCase, level: LogLevel): string {
        const emojiMap: Record<UseCase, string> = {
            auth: '🔐',
            cart: '🛒',
            order: '📦',
            product: '🏷️',
            api: '📡',
            socket: '🔌',
            image: '🖼️',
            payment: '💳',
            navigation: '🧭',
            form: '📝',
        }

        if (level === 'error') return '❌'
        if (level === 'warn') return '⚠️'
        return emojiMap[useCase] || '📋'
    }

    // Generic logging methods
    debug(context: LogContext, message: string, data?: unknown): void {
        this.formatMessage('debug', context, message, data)
    }

    info(context: LogContext, message: string, data?: unknown): void {
        this.formatMessage('info', context, message, data)
    }

    warn(context: LogContext, message: string, data?: unknown): void {
        this.formatMessage('warn', context, message, data)
    }

    error(context: LogContext, message: string, data?: unknown): void {
        this.formatMessage('error', context, message, data)
    }

    // UseCase-specific convenience methods
    auth = {
        login: (userId?: string, data?: unknown) =>
            this.info(
                { useCase: 'auth', action: 'login', userId },
                'User login attempt',
                data
            ),
        loginSuccess: (userId: string, data?: unknown) =>
            this.info(
                { useCase: 'auth', action: 'login_success', userId },
                'Login successful',
                data
            ),
        loginError: (error: unknown, data?: unknown) =>
            this.error(
                { useCase: 'auth', action: 'login_error' },
                'Login failed',
                { error, additionalData: data }
            ),
        logout: (userId?: string) =>
            this.info(
                { useCase: 'auth', action: 'logout', userId },
                'User logout'
            ),
        register: (data?: unknown) =>
            this.info(
                { useCase: 'auth', action: 'register' },
                'User registration attempt',
                data
            ),
        registerSuccess: (userId: string) =>
            this.info(
                { useCase: 'auth', action: 'register_success', userId },
                'Registration successful'
            ),
        registerError: (error: unknown) =>
            this.error(
                { useCase: 'auth', action: 'register_error' },
                'Registration failed',
                error
            ),
        tokenValidation: (isValid: boolean, userId?: string) =>
            this.debug(
                { useCase: 'auth', action: 'token_validation', userId },
                `Token validation: ${isValid ? 'valid' : 'invalid'}`
            ),
        profileLoad: (userId: string) =>
            this.debug(
                { useCase: 'auth', action: 'profile_load', userId },
                'Loading user profile'
            ),
        profileError: (error: unknown, userId?: string) =>
            this.error(
                { useCase: 'auth', action: 'profile_error', userId },
                'Profile loading failed',
                error
            ),
    }

    cart = {
        fetch: (userId?: string) =>
            this.debug(
                { useCase: 'cart', action: 'fetch', userId },
                'Fetching cart data'
            ),
        fetchSuccess: (itemCount: number, userId?: string) =>
            this.info(
                { useCase: 'cart', action: 'fetch_success', userId },
                `Cart loaded with ${itemCount} items`
            ),
        fetchError: (error: unknown, userId?: string) =>
            this.error(
                { useCase: 'cart', action: 'fetch_error', userId },
                'Failed to fetch cart',
                error
            ),
        addItem: (productId: string, quantity: number, userId?: string) =>
            this.info(
                { useCase: 'cart', action: 'add_item', userId },
                `Adding ${quantity}x product ${productId} to cart`
            ),
        addItemSuccess: (productName: string, userId?: string) =>
            this.info(
                { useCase: 'cart', action: 'add_item_success', userId },
                `Added "${productName}" to cart`
            ),
        addItemError: (error: unknown, productId?: string, userId?: string) =>
            this.error(
                { useCase: 'cart', action: 'add_item_error', userId },
                `Failed to add product ${productId} to cart`,
                error
            ),
        updateItem: (productId: string, quantity: number, userId?: string) =>
            this.info(
                { useCase: 'cart', action: 'update_item', userId },
                `Updating cart item ${productId} to quantity ${quantity}`
            ),
        removeItem: (productId: string, userId?: string) =>
            this.info(
                { useCase: 'cart', action: 'remove_item', userId },
                `Removing product ${productId} from cart`
            ),
        clear: (userId?: string) =>
            this.info(
                { useCase: 'cart', action: 'clear', userId },
                'Clearing cart'
            ),
    }

    order = {
        create: (orderData: unknown, userId?: string) =>
            this.info(
                { useCase: 'order', action: 'create', userId },
                'Creating new order',
                orderData
            ),
        createSuccess: (orderId: string, total: number, userId?: string) =>
            this.info(
                { useCase: 'order', action: 'create_success', userId },
                `Order ${orderId} created successfully (Total: ${total})`
            ),
        createError: (error: unknown, userId?: string) =>
            this.error(
                { useCase: 'order', action: 'create_error', userId },
                'Order creation failed',
                error
            ),
        fetch: (orderId: string, userId?: string) =>
            this.debug(
                { useCase: 'order', action: 'fetch', userId },
                `Fetching order ${orderId}`
            ),
        tracking: (orderId: string, status: string, userId?: string) =>
            this.info(
                { useCase: 'order', action: 'tracking', userId },
                `Order ${orderId} status: ${status}`
            ),
        statusUpdate: (
            orderId: string,
            oldStatus: string,
            newStatus: string,
            userId?: string
        ) =>
            this.info(
                { useCase: 'order', action: 'status_update', userId },
                `Order ${orderId} status changed: ${oldStatus} → ${newStatus}`
            ),
    }

    product = {
        fetch: (productId?: string) =>
            this.debug(
                { useCase: 'product', action: 'fetch' },
                productId
                    ? `Fetching product ${productId}`
                    : 'Fetching products'
            ),
        fetchSuccess: (count: number, filters?: unknown) =>
            this.info(
                { useCase: 'product', action: 'fetch_success' },
                `Loaded ${count} products`,
                filters
            ),
        fetchError: (error: unknown, productId?: string) =>
            this.error(
                { useCase: 'product', action: 'fetch_error' },
                `Failed to fetch ${productId ? `product ${productId}` : 'products'}`,
                error
            ),
        search: (query: string, results: number) =>
            this.info(
                { useCase: 'product', action: 'search' },
                `Search "${query}" returned ${results} results`
            ),
        filter: (filters: unknown, results: number) =>
            this.info(
                { useCase: 'product', action: 'filter' },
                `Applied filters returned ${results} results`,
                filters
            ),
    }

    api = {
        request: (method: string, endpoint: string, data?: unknown) =>
            this.debug(
                { useCase: 'api', action: 'request' },
                `${method} ${endpoint}`,
                data
            ),
        response: (
            method: string,
            endpoint: string,
            status: number,
            duration?: number
        ) =>
            this.debug(
                { useCase: 'api', action: 'response' },
                `${method} ${endpoint} → ${status}${duration ? ` (${duration}ms)` : ''}`
            ),
        error: (method: string, endpoint: string, error: unknown) =>
            this.error(
                { useCase: 'api', action: 'error' },
                `${method} ${endpoint} failed`,
                error
            ),
    }

    socket = {
        connect: (url: string, userId?: string) =>
            this.info(
                { useCase: 'socket', action: 'connect', userId },
                `Connecting to ${url}`
            ),
        connected: (userId?: string) =>
            this.info(
                { useCase: 'socket', action: 'connected', userId },
                'Socket connected successfully'
            ),
        disconnect: (reason: string, userId?: string) =>
            this.info(
                { useCase: 'socket', action: 'disconnect', userId },
                `Socket disconnected: ${reason}`
            ),
        joinRoom: (room: string, userId?: string) =>
            this.debug(
                { useCase: 'socket', action: 'join_room', userId },
                `Joined room: ${room}`
            ),
        leaveRoom: (room: string, userId?: string) =>
            this.debug(
                { useCase: 'socket', action: 'leave_room', userId },
                `Left room: ${room}`
            ),
        message: (event: string, data?: unknown, userId?: string) =>
            this.debug(
                { useCase: 'socket', action: 'message', userId },
                `Received event: ${event}`,
                data
            ),
        error: (error: unknown, userId?: string) =>
            this.error(
                { useCase: 'socket', action: 'error', userId },
                'Socket error',
                error
            ),
    }

    image = {
        loading: (src: string) =>
            this.debug(
                { useCase: 'image', action: 'loading' },
                `Loading image: ${src}`
            ),
        loaded: (src: string) =>
            this.debug(
                { useCase: 'image', action: 'loaded' },
                `Image loaded: ${src}`
            ),
        error: (src: string, fallback?: string) =>
            this.warn(
                { useCase: 'image', action: 'error' },
                `Failed to load image: ${src}${fallback ? `, using fallback: ${fallback}` : ''}`
            ),
    }

    payment = {
        initiate: (
            amount: number,
            currency: string,
            orderId: string,
            userId?: string
        ) =>
            this.info(
                { useCase: 'payment', action: 'initiate', userId },
                `Initiating payment for order ${orderId}: ${amount} ${currency}`
            ),
        success: (paymentId: string, orderId: string, userId?: string) =>
            this.info(
                { useCase: 'payment', action: 'success', userId },
                `Payment ${paymentId} successful for order ${orderId}`
            ),
        failed: (error: unknown, orderId: string, userId?: string) =>
            this.error(
                { useCase: 'payment', action: 'failed', userId },
                `Payment failed for order ${orderId}`,
                error
            ),
        webhook: (event: string, data?: unknown) =>
            this.info(
                { useCase: 'payment', action: 'webhook' },
                `Payment webhook received: ${event}`,
                data
            ),
    }

    form = {
        submit: (formName: string, data?: unknown, userId?: string) =>
            this.debug(
                { useCase: 'form', action: 'submit', userId },
                `Submitting ${formName} form`,
                data
            ),
        validation: (formName: string, errors: unknown, userId?: string) =>
            this.warn(
                { useCase: 'form', action: 'validation', userId },
                `Form validation errors in ${formName}`,
                errors
            ),
        success: (formName: string, result?: unknown, userId?: string) =>
            this.info(
                { useCase: 'form', action: 'success', userId },
                `${formName} form submitted successfully`,
                result
            ),
        error: (formName: string, error: unknown, userId?: string) =>
            this.error(
                { useCase: 'form', action: 'error', userId },
                `${formName} form submission failed`,
                error
            ),
    }

    navigation = {
        route: (from: string, to: string, userId?: string) =>
            this.debug(
                { useCase: 'navigation', action: 'route', userId },
                `Navigating from ${from} to ${to}`
            ),
        redirect: (to: string, reason: string, userId?: string) =>
            this.info(
                { useCase: 'navigation', action: 'redirect', userId },
                `Redirecting to ${to}: ${reason}`
            ),
    }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience function for quick debugging
export const debugLog = (useCase: UseCase, message: string, data?: unknown) => {
    logger.debug({ useCase }, message, data)
}
