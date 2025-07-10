'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Layout, logger } from '@/shared'

export default function LoggerDemoPage() {
    const [logCount, setLogCount] = useState(0)

    const demoAuth = () => {
        logger.auth.login('demo-user', { timestamp: new Date().toISOString() })
        logger.auth.loginSuccess('demo-user-123')
        logger.auth.profileLoad('demo-user-123')
        logger.auth.tokenValidation(true, 'demo-user-123')
        setLogCount((prev) => prev + 4)
    }

    const demoCart = () => {
        logger.cart.fetch('demo-user-123')
        logger.cart.addItem('product-456', 2, 'demo-user-123')
        logger.cart.addItemSuccess('iPhone 15 Pro', 'demo-user-123')
        logger.cart.updateItem('product-456', 3, 'demo-user-123')
        setLogCount((prev) => prev + 4)
    }

    const demoOrder = () => {
        const orderData = {
            total: 1599000,
            items: [{ productId: 'product-456', quantity: 1 }],
        }
        logger.order.create(orderData, 'demo-user-123')
        logger.order.createSuccess('order-789', 1599000, 'demo-user-123')
        logger.order.tracking('order-789', 'processing', 'demo-user-123')
        logger.order.statusUpdate(
            'order-789',
            'processing',
            'shipped',
            'demo-user-123'
        )
        setLogCount((prev) => prev + 4)
    }

    const demoProduct = () => {
        logger.product.fetch()
        logger.product.fetchSuccess(25, {
            category: 'electronics',
            search: 'iphone',
        })
        logger.product.search('MacBook Pro', 12)
        logger.product.filter(
            { category: 'electronics', priceRange: '1000-2000' },
            8
        )
        setLogCount((prev) => prev + 4)
    }

    const demoAPI = () => {
        logger.api.request('GET', '/api/products', { limit: 10 })
        logger.api.response('GET', '/api/products', 200, 245)
        logger.api.request('POST', '/api/cart/add', {
            productId: '123',
            quantity: 1,
        })
        logger.api.error('POST', '/api/cart/add', new Error('Network timeout'))
        setLogCount((prev) => prev + 4)
    }

    const demoSocket = () => {
        logger.socket.connect('ws://localhost:3001', 'demo-user-123')
        logger.socket.connected('demo-user-123')
        logger.socket.joinRoom('order-tracking-789', 'demo-user-123')
        logger.socket.message(
            'order_update',
            { status: 'shipped' },
            'demo-user-123'
        )
        setLogCount((prev) => prev + 4)
    }

    const demoImage = () => {
        logger.image.loading('/uploads/product-image.jpg')
        logger.image.error('/uploads/missing-image.jpg', '/placeholder.jpg')
        logger.image.loaded('/uploads/product-image.jpg')
        setLogCount((prev) => prev + 3)
    }

    const demoPayment = () => {
        logger.payment.initiate(1599000, 'VND', 'order-789', 'demo-user-123')
        logger.payment.success('payment-456', 'order-789', 'demo-user-123')
        logger.payment.webhook('payment.succeeded', {
            paymentId: 'payment-456',
        })
        setLogCount((prev) => prev + 3)
    }

    const demoForm = () => {
        logger.form.submit(
            'login',
            { email: 'demo@example.com' },
            'demo-user-123'
        )
        logger.form.validation('registration', {
            email: 'Invalid email format',
        })
        logger.form.success(
            'checkout',
            { orderId: 'order-789' },
            'demo-user-123'
        )
        logger.form.error('payment', new Error('Payment processing failed'))
        setLogCount((prev) => prev + 4)
    }

    const demoNavigation = () => {
        logger.navigation.route('/products', '/cart', 'demo-user-123')
        logger.navigation.redirect(
            '/login',
            'Authentication required',
            'demo-user-123'
        )
        setLogCount((prev) => prev + 2)
    }

    const demoErrors = () => {
        logger.auth.loginError(new Error('Invalid credentials'))
        logger.cart.fetchError(new Error('Network error'), 'demo-user-123')
        logger.product.fetchError(
            new Error('Database connection failed'),
            'product-123'
        )
        logger.socket.error(
            new Error('WebSocket connection lost'),
            'demo-user-123'
        )
        setLogCount((prev) => prev + 4)
    }

    const clearConsole = () => {
        console.clear()
        setLogCount(0)
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">
                        Logger Utility Demo
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        Demonstration of the comprehensive logging utility.
                        Check the browser console to see structured logs with
                        emojis and clear use-case identification.
                    </p>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline">
                            Logs Generated: {logCount}
                        </Badge>
                        <Button
                            onClick={clearConsole}
                            variant="outline"
                            size="sm"
                        >
                            Clear Console
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🔐 Authentication
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Login, logout, registration, profile management
                                logs
                            </p>
                            <Button onClick={demoAuth} className="w-full">
                                Demo Auth Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🛒 Shopping Cart
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Add to cart, update quantity, remove items logs
                            </p>
                            <Button onClick={demoCart} className="w-full">
                                Demo Cart Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📦 Order Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Order creation, tracking, status updates logs
                            </p>
                            <Button onClick={demoOrder} className="w-full">
                                Demo Order Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🏷️ Product Operations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Product fetch, search, filtering logs
                            </p>
                            <Button onClick={demoProduct} className="w-full">
                                Demo Product Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📡 API Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                HTTP requests, responses, API errors logs
                            </p>
                            <Button onClick={demoAPI} className="w-full">
                                Demo API Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🔌 WebSocket Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Socket connections, room management logs
                            </p>
                            <Button onClick={demoSocket} className="w-full">
                                Demo Socket Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🖼️ Image Loading
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Image loading states and error handling logs
                            </p>
                            <Button onClick={demoImage} className="w-full">
                                Demo Image Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                💳 Payment Processing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Payment initiation, success, webhooks logs
                            </p>
                            <Button onClick={demoPayment} className="w-full">
                                Demo Payment Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📝 Form Submissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Form validation, submission, error logs
                            </p>
                            <Button onClick={demoForm} className="w-full">
                                Demo Form Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🧭 Navigation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Route changes, redirects logs
                            </p>
                            <Button onClick={demoNavigation} className="w-full">
                                Demo Navigation Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                ❌ Error Scenarios
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Various error conditions across use cases
                            </p>
                            <Button
                                onClick={demoErrors}
                                className="w-full"
                                variant="destructive"
                            >
                                Demo Error Logs
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-8" />

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Logger Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    ✨ Key Benefits
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>
                                    • <strong>DRY Principle:</strong>{' '}
                                    Centralized logging utility
                                </p>
                                <p>
                                    • <strong>Use-case Specific:</strong> Clear
                                    context for each log
                                </p>
                                <p>
                                    • <strong>Consistent Format:</strong>{' '}
                                    Structured with emojis and levels
                                </p>
                                <p>
                                    • <strong>Development Only:</strong> Debug
                                    logs only in dev mode
                                </p>
                                <p>
                                    • <strong>TypeScript Safe:</strong> Full
                                    type safety and intellisense
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    🎯 Use Cases Covered
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>• Authentication & user management</p>
                                <p>• Shopping cart operations</p>
                                <p>• Order processing & tracking</p>
                                <p>• Product search & filtering</p>
                                <p>• API requests & responses</p>
                                <p>• WebSocket connections</p>
                                <p>• Image loading & errors</p>
                                <p>• Payment processing</p>
                                <p>• Form submissions</p>
                                <p>• Navigation & routing</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
