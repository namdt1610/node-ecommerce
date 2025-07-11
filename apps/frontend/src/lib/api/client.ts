import axios from 'axios'

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token')
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            hasToken: !!token,
            tokenStart: token?.substring(0, 20),
        })
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
        })
        return response
    },
    (error) => {
        const errorInfo = {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
            stack: error.stack,
        }
        console.error('API Error:', errorInfo)

        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
