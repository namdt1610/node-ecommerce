'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layout, useToast } from '@/shared'

export default function ToastDemoPage() {
    const {
        success,
        error,
        warning,
        info,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    } = useToast()

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Toast Demo</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Success Toasts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-600">
                                Success Toasts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                className="w-full"
                                onClick={() => success.login()}
                            >
                                Login Success
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() => success.register()}
                            >
                                Register Success
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() =>
                                    success.addToCart('iPhone 15 Pro')
                                }
                            >
                                Add to Cart
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() =>
                                    success.orderPlaced('ORD-123456')
                                }
                            >
                                Order Placed
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() =>
                                    showSuccess(
                                        'Custom Success',
                                        'This is a custom success message'
                                    )
                                }
                            >
                                Custom Success
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Error Toasts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-600">
                                Error Toasts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => error.login()}
                            >
                                Login Error
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => error.network()}
                            >
                                Network Error
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => error.addToCart()}
                            >
                                Add to Cart Error
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => error.orderFailed()}
                            >
                                Order Failed
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() =>
                                    showError(
                                        'Custom Error',
                                        'This is a custom error message'
                                    )
                                }
                            >
                                Custom Error
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Warning Toasts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-yellow-600">
                                Warning Toasts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full border-yellow-500 text-yellow-600"
                                onClick={() => warning.sessionExpired()}
                            >
                                Session Expired
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-yellow-500 text-yellow-600"
                                onClick={() => warning.lowStock(5)}
                            >
                                Low Stock Warning
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-yellow-500 text-yellow-600"
                                onClick={() => warning.emptyCart()}
                            >
                                Empty Cart
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-yellow-500 text-yellow-600"
                                onClick={() => warning.maxQuantity()}
                            >
                                Max Quantity
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-yellow-500 text-yellow-600"
                                onClick={() =>
                                    showWarning(
                                        'Custom Warning',
                                        'This is a custom warning message'
                                    )
                                }
                            >
                                Custom Warning
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Info Toasts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-blue-600">
                                Info Toasts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full border-blue-500 text-blue-600"
                                onClick={() => info.loading()}
                            >
                                Loading
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-blue-500 text-blue-600"
                                onClick={() => info.processing()}
                            >
                                Processing
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-blue-500 text-blue-600"
                                onClick={() => info.updating()}
                            >
                                Updating
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-blue-500 text-blue-600"
                                onClick={() => info.saving()}
                            >
                                Saving
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-blue-500 text-blue-600"
                                onClick={() =>
                                    showInfo(
                                        'Custom Info',
                                        'This is a custom info message'
                                    )
                                }
                            >
                                Custom Info
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Usage Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">
                            Toast notifications have been integrated throughout
                            the application:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>
                                <strong>Login/Register:</strong> Success and
                                error notifications for authentication
                            </li>
                            <li>
                                <strong>Cart Operations:</strong> Add to cart,
                                remove from cart, update quantity notifications
                            </li>
                            <li>
                                <strong>Order Management:</strong> Order
                                placement success/failure notifications
                            </li>
                            <li>
                                <strong>Form Validation:</strong> Error messages
                                for invalid input
                            </li>
                            <li>
                                <strong>Network Issues:</strong> Connection and
                                server error notifications
                            </li>
                        </ul>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Import <code>useToast</code> from{' '}
                            <code>@/shared</code> to use toast notifications in
                            any component.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}
