'use client'

import { useState } from 'react'
import { Layout } from '@/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Package,
    Play,
    Truck,
    Clock,
    CheckCircle,
    Wifi,
    WifiOff,
} from 'lucide-react'

export default function OrderTrackingDemo() {
    const [orderId, setOrderId] = useState('')
    const [isTracking, setIsTracking] = useState(false)
    const [isConnected, setIsConnected] = useState(false)

    const handleStartDemo = () => {
        setIsTracking(true)
        setIsConnected(true)

        // Simulate connection and tracking updates
        setTimeout(() => {
            setIsConnected(false)
            setIsTracking(false)
        }, 30000) // Demo runs for 30 seconds
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">
                        Demo: Theo dõi đơn hàng Real-time
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Trải nghiệm tính năng theo dõi đơn hàng real-time với
                        WebSocket
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Demo Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Play className="h-5 w-5" />
                                Bắt đầu Demo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="orderId">
                                    Mã đơn hàng (tùy chọn)
                                </Label>
                                <Input
                                    id="orderId"
                                    placeholder="Nhập mã đơn hàng hoặc để trống"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={handleStartDemo}
                                disabled={isTracking}
                                className="w-full"
                            >
                                {isTracking ? (
                                    <>
                                        <Truck className="h-4 w-4 mr-2 animate-bounce" />
                                        Đang theo dõi...
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Bắt đầu Demo
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-2 text-sm">
                                {isConnected ? (
                                    <>
                                        <Wifi className="h-4 w-4 text-green-500" />
                                        <span className="text-green-500">
                                            Kết nối WebSocket
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="h-4 w-4 text-red-500" />
                                        <span className="text-red-500">
                                            Chưa kết nối
                                        </span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Tính năng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        Theo dõi real-time với WebSocket
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        Timeline trạng thái đơn hàng
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        Thông tin vị trí giao hàng
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        Cập nhật tự động
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                        Giao diện responsive
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Demo Timeline */}
                {isTracking && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Demo Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="font-medium">
                                            Đơn hàng được tạo
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date().toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Package className="h-5 w-5 text-yellow-500" />
                                    <div>
                                        <p className="font-medium">
                                            Đang chuẩn bị hàng
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Kho hàng Hà Nội
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Truck className="h-5 w-5 text-orange-500" />
                                    <div>
                                        <p className="font-medium">
                                            Đang vận chuyển
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Trung tâm phân loại
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Instructions */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Hướng dẫn sử dụng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <p>
                                1. Để trải nghiệm đầy đủ, hãy đăng nhập và tạo
                                một đơn hàng
                            </p>
                            <p>
                                2. Vào trang &quot;Đơn hàng của bạn&quot; và
                                nhấn &quot;Theo dõi&quot;
                            </p>
                            <p>
                                3. Nhấn &quot;Bắt đầu theo dõi real-time&quot;
                                để xem demo
                            </p>
                            <p>
                                4. Trạng thái đơn hàng sẽ được cập nhật tự động
                                qua WebSocket
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}
