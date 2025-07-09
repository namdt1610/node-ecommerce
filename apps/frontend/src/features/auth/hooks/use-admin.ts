import { useAuth } from '../providers/auth-provider'

export function useAdmin() {
    const { user, isAuthenticated, isLoading } = useAuth()

    // Get user role (role is a string according to our User interface)
    const userRole = user?.role?.toLowerCase() || ''

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
