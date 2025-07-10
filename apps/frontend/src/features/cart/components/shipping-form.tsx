/**
 * Shipping Form Component
 * Handles shipping information input and validation
 */

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

export interface ShippingInfo {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
    notes: string
}

interface ShippingFormProps {
    shippingInfo: ShippingInfo
    onInputChange: (field: keyof ShippingInfo, value: string) => void
    disabled?: boolean
}

export function ShippingForm({
    shippingInfo,
    onInputChange,
    disabled = false,
}: ShippingFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Thông tin giao hàng
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên *</Label>
                        <Input
                            id="fullName"
                            value={shippingInfo.fullName}
                            onChange={(e) =>
                                onInputChange('fullName', e.target.value)
                            }
                            placeholder="Nhập họ và tên"
                            disabled={disabled}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) =>
                                onInputChange('email', e.target.value)
                            }
                            placeholder="Nhập email"
                            disabled={disabled}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => onInputChange('phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        disabled={disabled}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ cụ thể *</Label>
                    <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) =>
                            onInputChange('address', e.target.value)
                        }
                        placeholder="Số nhà, tên đường"
                        disabled={disabled}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ward">Phường/Xã *</Label>
                        <Input
                            id="ward"
                            value={shippingInfo.ward}
                            onChange={(e) =>
                                onInputChange('ward', e.target.value)
                            }
                            placeholder="Phường/Xã"
                            disabled={disabled}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="district">Quận/Huyện *</Label>
                        <Input
                            id="district"
                            value={shippingInfo.district}
                            onChange={(e) =>
                                onInputChange('district', e.target.value)
                            }
                            placeholder="Quận/Huyện"
                            disabled={disabled}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                        <Input
                            id="city"
                            value={shippingInfo.city}
                            onChange={(e) =>
                                onInputChange('city', e.target.value)
                            }
                            placeholder="Tỉnh/Thành phố"
                            disabled={disabled}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                    <Textarea
                        id="notes"
                        value={shippingInfo.notes}
                        onChange={(e) => onInputChange('notes', e.target.value)}
                        placeholder="Ghi chú thêm cho đơn hàng..."
                        disabled={disabled}
                        rows={3}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
