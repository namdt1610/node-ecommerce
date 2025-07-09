# Admin Real-Time Dashboard

## 🚀 **Overview**

Dashboard real-time cho admin để theo dõi và quản lý hệ thống ecommerce. Dashboard cung cấp thống kê, analytics và cập nhật real-time về orders, users, products, payments và hoạt động của hệ thống.

## 🏗️ **Architecture**

### **Clean Architecture Pattern**
```
dashboard/
├── domain/
│   └── interfaces/
│       ├── dashboard-repository.interface.ts
│       └── dashboard-container.ts
├── application/
│   └── use-cases/
│       ├── get-dashboard-stats.usecase.ts
│       ├── get-sales-analytics.usecase.ts
│       ├── get-user-analytics.usecase.ts
│       ├── get-product-analytics.usecase.ts
│       └── get-recent-activity.usecase.ts
├── infrastructure/
│   ├── repositories/
│   │   └── dashboard.repository.ts
│   └── services/
│       └── socket.service.ts
└── presentation/
    └── controllers/
        └── dashboard.controller.ts
```

## 📊 **Features**

### **1. Dashboard Statistics**
- Total revenue và revenue hôm nay
- Số lượng orders (total, pending, completed, cancelled)
- Số lượng users và users mới hôm nay
- Số lượng products và low stock alerts
- Số lượng categories

### **2. Sales Analytics**
- Daily/Weekly/Monthly revenue charts
- Top selling products
- Recent orders với user information
- Sales trends và growth metrics

### **3. User Analytics**
- Total users và active users
- New users this month
- User growth trends theo tháng
- User activity patterns

### **4. Product Analytics**
- Total products inventory
- Low stock và out of stock alerts
- Top categories by product count
- Recently added products

### **5. Real-Time Features**
- Live updates khi có order mới
- Real-time notifications cho admin
- Auto-refresh dashboard data
- WebSocket connection status

## 📚 **API Endpoints**

### **Authentication Required**: Tất cả endpoints yêu cầu admin authentication

### **1. Dashboard Stats**
```http
GET /api/dashboard/stats
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 125000.50,
    "totalOrders": 1250,
    "totalUsers": 890,
    "totalProducts": 145,
    "totalCategories": 12,
    "pendingOrders": 25,
    "completedOrders": 1200,
    "cancelledOrders": 25,
    "todayRevenue": 2500.00,
    "todayOrders": 15,
    "newUsersToday": 5,
    "lowStockProducts": 8
  },
  "message": "Dashboard stats retrieved successfully"
}
```

### **2. Sales Analytics**
```http
GET /api/dashboard/analytics/sales?days=30
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dailyRevenue": [
      {
        "date": "2024-01-15",
        "revenue": 2500.00,
        "orders": 15
      }
    ],
    "weeklyRevenue": [...],
    "monthlyRevenue": [...],
    "topProducts": [
      {
        "id": "prod_123",
        "name": "iPhone 15",
        "sales": 45,
        "revenue": 44999.55,
        "image": "product-image.jpg"
      }
    ],
    "recentOrders": [
      {
        "id": "order_456",
        "userId": "user_789",
        "userName": "John Doe",
        "userEmail": "john@example.com",
        "status": "COMPLETED",
        "total": 999.99,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### **3. User Analytics**
```http
GET /api/dashboard/analytics/users
Authorization: Bearer <admin_jwt_token>
```

### **4. Product Analytics**
```http
GET /api/dashboard/analytics/products
Authorization: Bearer <admin_jwt_token>
```

### **5. Recent Activity**
```http
GET /api/dashboard/activity
Authorization: Bearer <admin_jwt_token>
```

### **6. All Dashboard Data**
```http
GET /api/dashboard/all?days=30
Authorization: Bearer <admin_jwt_token>
```

### **7. Trigger Refresh**
```http
POST /api/dashboard/refresh
Authorization: Bearer <admin_jwt_token>
```

### **8. Dashboard Status**
```http
GET /api/dashboard/status
Authorization: Bearer <admin_jwt_token>
```

## 🔄 **Real-Time WebSocket Events**

### **Connection**
```javascript
// Frontend connection
import io from 'socket.io-client'

const socket = io('http://localhost:3030', {
  auth: {
    token: 'your_admin_jwt_token'
  }
})
```

### **Events từ Server**

#### **1. Connection Events**
```javascript
socket.on('dashboard:connected', (data) => {
  console.log('Connected to admin dashboard:', data.message)
})

socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message)
})
```

#### **2. Dashboard Updates**
```javascript
socket.on('dashboard:update', (data) => {
  console.log('Dashboard update:', data.type, data.data)
  // Update UI with new data
})
```

#### **3. Real-Time Notifications**
```javascript
socket.on('dashboard:notification', (notification) => {
  console.log('New notification:', notification)
  // Show notification to admin
  showNotification({
    title: notification.title,
    message: notification.message,
    type: notification.type, // 'success', 'info', 'warning', 'error'
    timestamp: notification.timestamp
  })
})
```

### **Events từ Client**

#### **1. Request Data**
```javascript
// Request specific data updates
socket.emit('dashboard:request-stats')
socket.emit('dashboard:request-sales', { days: 30 })
socket.emit('dashboard:request-users')
socket.emit('dashboard:request-products')
socket.emit('dashboard:request-activity')
```

## 🎯 **Frontend Integration Examples**

### **React Dashboard Component**

```typescript
// hooks/useDashboard.ts
import { useState, useEffect } from 'react'
import io from 'socket.io-client'

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const socket = io('http://localhost:3030', {
      auth: { token }
    })

    socket.on('connect', () => {
      setConnected(true)
    })

    socket.on('dashboard:connected', (data) => {
      console.log('Dashboard connected:', data.message)
    })

    socket.on('dashboard:update', (data) => {
      setDashboardData(prev => ({
        ...prev,
        [data.type]: data.data
      }))
    })

    socket.on('dashboard:notification', (notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 4)])
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    return () => socket.disconnect()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      const data = await response.json()
      setDashboardData(data.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  return {
    dashboardData,
    notifications,
    connected,
    fetchDashboardData
  }
}
```

```typescript
// components/AdminDashboard.tsx
import React, { useEffect } from 'react'
import { useDashboard } from '../hooks/useDashboard'

export default function AdminDashboard() {
  const { dashboardData, notifications, connected, fetchDashboardData } = useDashboard()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (!dashboardData) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      {/* Connection Status */}
      <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
        {connected ? '🟢 Real-time Connected' : '🔴 Disconnected'}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard 
          title="Total Revenue" 
          value={`$${dashboardData.stats?.totalRevenue?.toLocaleString()}`}
          change={`+$${dashboardData.stats?.todayRevenue?.toLocaleString()} today`}
        />
        <StatsCard 
          title="Total Orders" 
          value={dashboardData.stats?.totalOrders}
          change={`${dashboardData.stats?.todayOrders} today`}
        />
        <StatsCard 
          title="Total Users" 
          value={dashboardData.stats?.totalUsers}
          change={`+${dashboardData.stats?.newUsersToday} today`}
        />
        <StatsCard 
          title="Low Stock Products" 
          value={dashboardData.stats?.lowStockProducts}
          type="warning"
        />
      </div>

      {/* Charts */}
      <div className="charts-section">
        <SalesChart data={dashboardData.salesAnalytics?.dailyRevenue} />
        <UserGrowthChart data={dashboardData.userAnalytics?.userGrowth} />
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h3>Recent Activity</h3>
        <ActivityFeed activities={dashboardData.recentActivity} />
      </div>

      {/* Real-time Notifications */}
      <div className="notifications">
        {notifications.map(notification => (
          <NotificationCard key={notification.timestamp} {...notification} />
        ))}
      </div>
    </div>
  )
}
```

### **Chart Components với Chart.js**

```typescript
// components/SalesChart.tsx
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function SalesChart({ data }) {
  const chartData = {
    labels: data?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Revenue',
        data: data?.map(item => item.revenue) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: data?.map(item => item.orders) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y1',
      },
    ],
  }

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue ($)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Orders'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return <Line data={chartData} options={options} />
}
```

## 🔐 **Security**

### **Authentication & Authorization**
- Admin JWT token required cho tất cả API endpoints
- Socket.IO authentication middleware
- Role-based access control (chỉ admin mới access được)

### **Rate Limiting**
```typescript
// Implement rate limiting for dashboard APIs
import rateLimit from 'express-rate-limit'

const dashboardRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many dashboard requests'
})

app.use('/api/dashboard', dashboardRateLimit)
```

## 📊 **Performance Optimization**

### **1. Caching Strategy**
```typescript
// Redis caching for dashboard data
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

// Cache dashboard stats for 5 minutes
export async function getCachedDashboardStats() {
  const cached = await redis.get('dashboard:stats')
  if (cached) {
    return JSON.parse(cached)
  }
  
  const stats = await dashboardRepository.getDashboardStats()
  await redis.setex('dashboard:stats', 300, JSON.stringify(stats))
  return stats
}
```

### **2. Database Query Optimization**
- Indexed queries cho analytics
- Aggregation pipelines
- Pagination cho large datasets

### **3. Real-time Updates Throttling**
- Debounce frequent updates
- Batch notifications
- Connection pooling

## 🧪 **Testing**

### **Unit Tests**
```typescript
// tests/dashboard.test.ts
import { DashboardRepository } from '../infrastructure/repositories/dashboard.repository'
import { GetDashboardStatsUseCase } from '../application/use-cases/get-dashboard-stats.usecase'

describe('Dashboard Use Cases', () => {
  it('should get dashboard stats', async () => {
    const mockRepo = {
      getDashboardStats: jest.fn().mockResolvedValue({
        totalRevenue: 1000,
        totalOrders: 10
      })
    }
    
    const useCase = new GetDashboardStatsUseCase(mockRepo as any)
    const result = await useCase.execute()
    
    expect(result.totalRevenue).toBe(1000)
    expect(result.totalOrders).toBe(10)
  })
})
```

### **Integration Tests**
```typescript
// tests/dashboard-api.test.ts
import request from 'supertest'
import app from '../app'

describe('Dashboard API', () => {
  it('should return dashboard stats for admin', async () => {
    const adminToken = 'valid_admin_jwt_token'
    
    const response = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty('totalRevenue')
  })
})
```

## 🚀 **Deployment**

### **Environment Variables**
```bash
# Real-time features
SOCKET_IO_CORS_ORIGIN="https://yourdomain.com"
DASHBOARD_CACHE_TTL=300

# Redis for caching (optional)
REDIS_URL="redis://localhost:6379"

# Admin credentials
ADMIN_JWT_SECRET="your_admin_jwt_secret"
```

### **Production Considerations**
1. **Clustering**: Socket.IO Redis adapter cho multiple server instances
2. **SSL/TLS**: HTTPS cho production WebSocket connections
3. **CDN**: Static assets caching
4. **Monitoring**: Application performance monitoring
5. **Backup**: Regular database backups cho analytics data

Admin Dashboard đã sẵn sàng để deploy và sử dụng! 🎉 