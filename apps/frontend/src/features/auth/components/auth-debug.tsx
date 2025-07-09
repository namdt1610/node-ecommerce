'use client'

import { useAuth } from '../providers/auth-provider'

export function AuthDebug() {
    const { user, isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="p-4 bg-yellow-100 rounded">
                🔄 Loading auth state...
            </div>
        )
    }

    return (
        <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Auth State Debug</h3>
            <div className="space-y-1 text-sm">
                <div>
                    <strong>Is Authenticated:</strong>{' '}
                    {isAuthenticated ? '✅ Yes' : '❌ No'}
                </div>
                <div>
                    <strong>User:</strong>{' '}
                    {user
                        ? `${user.firstName} ${user.lastName} (${user.email})`
                        : 'None'}
                </div>
                <div>
                    <strong>Token:</strong>{' '}
                    {localStorage.getItem('token') ? 'Present' : 'Missing'}
                </div>
                <div>
                    <strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}
                </div>
            </div>
        </div>
    )
}
