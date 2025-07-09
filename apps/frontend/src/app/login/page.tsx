import { Layout } from '@/shared'
import { LoginForm } from '@/features/auth'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Đăng nhập - ShopVite',
    description: 'Đăng nhập vào tài khoản ShopVite của bạn',
}

export default function LoginPage() {
    return (
        <Layout>
            <LoginForm />
        </Layout>
    )
}
