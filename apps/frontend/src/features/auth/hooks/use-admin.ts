import { useAuth } from '../providers/auth-provider'

export function useAdmin() {
    const { user, isAuthenticated, isLoading } = useAuth()

    // Debug logging
    console.log('🔍 useAdmin Debug:', {
        user: user,
        userRole: user?.role,
        isAuthenticated,
        isLoading,
    })

    // Get user role - now always an object format
    const userRole = user?.role?.name?.toLowerCase() || ''

    console.log('🔍 Processed userRole:', userRole)

    // Check if user has admin role
    const isAdmin = userRole === 'admin'

    // Check if user has full admin access (authenticated + admin role)
    const hasAdminAccess = isAuthenticated && isAdmin

    return {
        isAdmin,
        hasAdminAccess,
        userRole,
        isLoading,
        canAccessDashboard: hasAdminAccess,
        // For debugging
        user,
        isAuthenticated,
    }
}
