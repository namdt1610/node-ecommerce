'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useRegister } from '@/hooks/use-api'
import { ROUTES } from '@/shared/constants'
import { isValidEmail } from '@/shared/utils'

interface RegisterFormData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<Partial<RegisterFormData>>({})

    const router = useRouter()
    const registerMutation = useRegister()

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterFormData> = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Họ là bắt buộc'
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Tên là bắt buộc'
        }

        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc'
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await registerMutation.mutateAsync({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            })

            // Show success message and redirect to login
            alert('Đăng ký thành công! Vui lòng đăng nhập.')
            router.push(ROUTES.LOGIN)
        } catch (error) {
            console.error('Registration failed:', error)
            setErrors({ email: 'Email đã được sử dụng hoặc có lỗi xảy ra' })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name as keyof RegisterFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Nhập họ"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="pl-10"
                            disabled={registerMutation.isPending}
                        />
                    </div>
                    {errors.firstName && (
                        <p className="text-sm text-red-600">
                            {errors.firstName}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Nhập tên"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="pl-10"
                            disabled={registerMutation.isPending}
                        />
                    </div>
                    {errors.lastName && (
                        <p className="text-sm text-red-600">
                            {errors.lastName}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={registerMutation.isPending}
                    />
                </div>
                {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        disabled={registerMutation.isPending}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={registerMutation.isPending}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Xác nhận mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        disabled={registerMutation.isPending}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={registerMutation.isPending}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                        {errors.confirmPassword}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
            >
                {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
        </form>
    )
}
