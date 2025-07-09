import { Layout } from '@/shared'
import { RegisterForm } from '@/features/auth'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Đăng ký - ShopVite',
    description: 'Tạo tài khoản ShopVite mới để bắt đầu mua sắm',
}

export default function RegisterPage() {
    return (
        <Layout>
            <RegisterForm />
        </Layout>
    )
}
