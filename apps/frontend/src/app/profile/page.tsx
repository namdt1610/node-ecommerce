'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/shared'
import { useAuth } from '@/features/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Settings, Lock, Calendar, Shield } from 'lucide-react'
import { useProfile, useUpdateProfile } from '@/hooks/use-api'

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const { data: profileData, isLoading: profileLoading } = useProfile()
    const updateProfileMutation = useUpdateProfile()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
    })

    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
        router.push('/login')
        return null
    }

    const profile = profileData || user
    const isLoading = authLoading || profileLoading

    // Update form data when profile loads
    if (profile && !formData.firstName && !isEditing) {
        setFormData({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || '',
            username: profile.username || '',
        })
    }

    const handleEdit = () => {
        setIsEditing(true)
        setFormData({
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            email: profile?.email || '',
            username: profile?.username || '',
        })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData({
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            email: profile?.email || '',
            username: profile?.username || '',
        })
    }

    const handleSave = async () => {
        try {
            await updateProfileMutation.mutateAsync({
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">
                            Đang tải...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Overview */}
                    <Card className="md:col-span-1">
                        <CardHeader className="text-center">
                            <Avatar className="w-24 h-24 mx-auto mb-4">
                                <AvatarImage src={profile?.avatar} />
                                <AvatarFallback className="text-2xl">
                                    {profile?.firstName?.[0]}
                                    {profile?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-xl">
                                {profile?.firstName} {profile?.lastName}
                            </CardTitle>
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                {profile?.email}
                            </div>
                            <div className="flex justify-center mt-2">
                                <Badge
                                    variant={
                                        profile?.role === 'admin'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    <Shield className="w-3 h-3 mr-1" />
                                    {profile?.role === 'admin'
                                        ? 'Quản trị viên'
                                        : 'Người dùng'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        Tham gia:{' '}
                                        {new Date(
                                            profile?.createdAt || ''
                                        ).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span>ID: {profile?.id}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Information */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Thông tin cá nhân
                                </CardTitle>
                                {!isEditing ? (
                                    <Button
                                        onClick={handleEdit}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Chỉnh sửa
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            size="sm"
                                            disabled={
                                                updateProfileMutation.isPending
                                            }
                                        >
                                            {updateProfileMutation.isPending
                                                ? 'Đang lưu...'
                                                : 'Lưu'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Họ</Label>
                                    {isEditing ? (
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Nhập họ"
                                        />
                                    ) : (
                                        <div className="p-2 border rounded-md bg-muted/50">
                                            {profile?.firstName ||
                                                'Chưa cập nhật'}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Tên</Label>
                                    {isEditing ? (
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Nhập tên"
                                        />
                                    ) : (
                                        <div className="p-2 border rounded-md bg-muted/50">
                                            {profile?.lastName ||
                                                'Chưa cập nhật'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="p-2 border rounded-md bg-muted/50 text-muted-foreground">
                                    {profile?.email}
                                    <span className="text-xs ml-2">
                                        (Không thể thay đổi)
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Tên người dùng</Label>
                                {isEditing ? (
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên người dùng"
                                    />
                                ) : (
                                    <div className="p-2 border rounded-md bg-muted/50">
                                        {profile?.username || 'Chưa cập nhật'}
                                    </div>
                                )}
                            </div>

                            {updateProfileMutation.error && (
                                <div className="text-sm text-destructive">
                                    Cập nhật thất bại. Vui lòng thử lại.
                                </div>
                            )}

                            <Separator />

                            {/* Additional Actions */}
                            <div className="space-y-3">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Bảo mật
                                </h3>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
