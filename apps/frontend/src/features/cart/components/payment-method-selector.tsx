/**
 * Payment Method Selector Component
 * Handles payment method selection and display
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CreditCard, Banknote } from 'lucide-react'

interface PaymentMethodSelectorProps {
    paymentMethod: string
    onPaymentMethodChange: (method: string) => void
    disabled?: boolean
}

export function PaymentMethodSelector({
    paymentMethod,
    onPaymentMethodChange,
    disabled = false,
}: PaymentMethodSelectorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Phương thức thanh toán
                </CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={paymentMethod}
                    onValueChange={onPaymentMethodChange}
                    disabled={disabled}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label
                            htmlFor="cod"
                            className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                            <Banknote className="h-5 w-5 text-green-600" />
                            <div>
                                <div className="font-medium">
                                    Thanh toán khi nhận hàng (COD)
                                </div>
                                <div className="text-sm text-gray-500">
                                    Thanh toán bằng tiền mặt khi nhận hàng
                                </div>
                            </div>
                        </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 opacity-50">
                        <RadioGroupItem value="card" id="card" disabled />
                        <Label
                            htmlFor="card"
                            className="flex items-center gap-2 cursor-not-allowed flex-1"
                        >
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <div>
                                <div className="font-medium">
                                    Thanh toán bằng thẻ (Sắp ra mắt)
                                </div>
                                <div className="text-sm text-gray-500">
                                    Visa, Mastercard, JCB
                                </div>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    )
}
