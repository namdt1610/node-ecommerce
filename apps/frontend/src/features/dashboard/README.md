# Admin Dashboard Feature

A minimalist but full-featured admin panel for the ecommerce application.

## 🌟 Features

### ✅ **Real-time Dashboard**
- Live statistics updates via Socket.IO
- Auto-refreshing data every 15-30 seconds
- Real-time connection status indicator

### 📊 **Key Metrics**
- Total revenue and today's revenue
- Order statistics (total, pending, completed, cancelled)
- User analytics (total users, new users today)
- Product inventory (total products, low stock alerts)
- Category counts

### 📈 **Analytics**
- Recent orders with user information and status
- Top selling products with sales metrics
- Recent system activities (orders, users, products)
- Time period filters (7, 30, 90 days)

### 🔐 **Security**
- Admin role authentication required
- JWT token validation
- Protected routes with role checking

## 🚀 **Usage**

### **Access**
1. Login with an admin account (role: 'ADMIN')
2. Navigate to `/admin` or click "Admin Dashboard" in the navigation
3. Dashboard loads with real-time data

### **Components**

#### **StatsCards**
Displays 8 key metrics in card format with icons and colors:
- Revenue metrics
- Order statistics  
- User counts
- Product inventory alerts

#### **RecentOrders**
Shows the latest orders with:
- Order ID and status badges
- Customer information
- Order total and timestamp
- Vietnamese date/time formatting

#### **TopProducts**
Lists best-selling products with:
- Ranking indicators
- Sales quantity and revenue
- Product names

#### **RecentActivity**
Timeline of system activities:
- Order events (created, updated, cancelled)
- User events (registered, updated)
- Product events (created, updated, deleted)
- Relative time formatting in Vietnamese

## 🔧 **Real-time Features**

### **Socket.IO Integration**
- Connects to backend WebSocket server
- Listens for dashboard update events
- Auto-invalidates React Query cache on updates
- Shows connection status in UI

### **Auto-refresh**
- Stats: Every 30 seconds
- Sales analytics: Every 60 seconds  
- Activity: Every 15 seconds
- Manual refresh button available

## 🎨 **Design**

### **Minimalist UI**
- Clean card-based layout
- Responsive grid system
- Loading states with skeleton UI
- Error states with helpful messages

### **Color Coding**
- Green: Revenue and positive metrics
- Blue: Order and user metrics
- Purple: Product metrics
- Yellow: Pending/warning states
- Red: Error/critical states

### **Vietnamese Localization**
- All text in Vietnamese
- VND currency formatting
- Vietnamese date/time formatting
- Appropriate status translations

## 📱 **Responsive Design**

- **Desktop**: 4-column grid for stats cards
- **Tablet**: 2-column grid layout
- **Mobile**: Single column stack
- **All devices**: Responsive cards and typography

## 🔌 **API Integration**

### **Endpoints Used**
- `GET /api/dashboard/stats` - Main statistics
- `GET /api/dashboard/analytics/sales` - Sales data
- `GET /api/dashboard/activity` - Recent activities
- `POST /api/dashboard/refresh` - Manual refresh

### **Real-time Events**
- `dashboard:stats-update` - Stats changes
- `dashboard:sales-update` - Sales changes  
- `dashboard:activity-update` - New activities
- `dashboard:update` - Full dashboard refresh

## 📦 **File Structure**

```
features/dashboard/
├── components/
│   ├── dashboard-page.tsx      # Main dashboard page
│   ├── stats-cards.tsx         # Statistics cards
│   ├── recent-orders.tsx       # Recent orders list
│   ├── top-products.tsx        # Top products list
│   └── recent-activity.tsx     # Activity timeline
├── hooks/
│   └── use-socket.ts           # Socket.IO integration
├── index.ts                    # Feature exports
└── README.md                   # This file
```

## 🚀 **Getting Started**

1. **Backend must be running** with dashboard API endpoints
2. **Socket.IO server** must be configured on backend
3. **Admin user account** must exist in database
4. Navigate to `/admin` after logging in as admin

The dashboard is fully functional with real-time updates and comprehensive ecommerce metrics! 