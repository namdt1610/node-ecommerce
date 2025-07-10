import api from './client'

export const dashboardApi = {
    getStats: () => api.get('/dashboard/stats'),
    getSalesAnalytics: (days?: number) =>
        api.get(`/dashboard/analytics/sales${days ? `?days=${days}` : ''}`),
    getUserAnalytics: () => api.get('/dashboard/analytics/users'),
    getProductAnalytics: () => api.get('/dashboard/analytics/products'),
    getRecentActivity: () => api.get('/dashboard/activity'),
    getAllData: (days?: number) =>
        api.get(`/dashboard/all${days ? `?days=${days}` : ''}`),
    refreshDashboard: () => api.post('/dashboard/refresh'),
    getDashboardStatus: () => api.get('/dashboard/status'),
}
