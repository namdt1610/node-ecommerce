'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useLogin } from '@/hooks/use-api'
import { useAuth } from '../providers/auth-provider'
import { ROUTES } from '@/shared/constants'
import { isValidEmail } from '@/shared/utils'

interface LoginFormData {
    email: string
    password: string
}

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<Partial<LoginFormData>>({})

    const router = useRouter()
    const loginMutation = useLogin()
    const { login } = useAuth()

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginFormData> = {}

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

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            const response = await loginMutation.mutateAsync(formData)
            if (response.data.accessToken) {
                login(response.data.accessToken)
                router.push(ROUTES.HOME)
            }
        } catch (error) {
            console.error('Login failed:', error)
            setErrors({ email: 'Email hoặc mật khẩu không đúng' })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name as keyof LoginFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                        disabled={loginMutation.isPending}
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
                        placeholder="Nhập mật khẩu của bạn"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        disabled={loginMutation.isPending}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loginMutation.isPending}
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

            <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
            >
                {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
        </form>
    )
}
