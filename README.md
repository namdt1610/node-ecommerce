# Node E-commerce Platform

Một nền tảng thương mại điện tử hiện đại được xây dựng với kiến trúc microservices, sử dụng Node.js cho backend và Next.js cho frontend. Dự án được thiết kế với mục tiêu tạo ra một hệ thống có khả năng mở rộng cao, dễ bảo trì và có hiệu suất tốt.

## Kiến trúc tổng quan

### Lý do chọn Monorepo Architecture

Dự án sử dụng kiến trúc monorepo với npm workspaces để quản lý cả backend và frontend trong cùng một repository. Cách tiếp cận này mang lại những lợi ích sau:

- **Chia sẻ code dễ dàng**: Các utility functions, types, và constants có thể được chia sẻ giữa backend và frontend
- **Quản lý dependencies tập trung**: Tất cả dependencies được quản lý ở root level, tránh duplicate và conflict
- **Deployment đồng bộ**: Có thể deploy cả hai services cùng lúc với cùng version
- **Development workflow đơn giản**: Chỉ cần một lệnh để chạy cả hệ thống

### Backend Architecture: Clean Architecture với Domain-Driven Design

Backend được thiết kế theo nguyên tắc Clean Architecture, chia thành các layer rõ ràng:

```
src/
├── modules/           # Business modules (auth, product, order, etc.)
│   ├── domain/        # Business logic và entities
│   ├── application/   # Use cases và business rules
│   ├── infrastructure/# External concerns (database, external APIs)
│   └── presentation/  # Controllers và routes
├── core/              # Shared utilities và base classes
├── config/            # Configuration management
└── common/            # Middleware và shared components
```

**Lý do chọn Clean Architecture:**

- **Separation of Concerns**: Mỗi layer có trách nhiệm riêng biệt, dễ test và maintain
- **Dependency Inversion**: Business logic không phụ thuộc vào external concerns
- **Testability**: Có thể test business logic độc lập với database và external services
- **Flexibility**: Dễ dàng thay đổi implementation mà không ảnh hưởng business logic

### Frontend Architecture: Feature-based với App Router

Frontend sử dụng Next.js 15 với App Router, được tổ chức theo feature-based architecture:

```
src/
├── app/               # Next.js App Router pages
├── features/          # Feature-based components
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions và configurations
└── shared/            # Shared types và constants
```

**Lý do chọn Next.js 15 với App Router:**

- **Server Components**: Cải thiện performance với server-side rendering
- **File-based Routing**: Routing đơn giản và intuitive
- **Built-in Optimization**: Automatic code splitting, image optimization
- **TypeScript Support**: First-class TypeScript support

## Công nghệ và thư viện được chọn

### Backend Technologies

#### Express.js + TypeScript
**Lý do chọn:** Express.js là framework Node.js phổ biến nhất với ecosystem lớn, dễ học và có performance tốt. TypeScript được thêm vào để có type safety, giúp giảm bugs và cải thiện developer experience.

#### Prisma ORM
**Lý do chọn:** Prisma cung cấp type-safe database access với auto-generated types từ schema. Điều này đảm bảo consistency giữa database schema và application code, giảm runtime errors.

#### PostgreSQL
**Lý do chọn:** PostgreSQL là relational database mạnh mẽ với ACID compliance, hỗ trợ JSON fields, full-text search, và có performance tốt cho complex queries. Phù hợp cho e-commerce với nhiều relationships phức tạp.

#### Redis
**Lý do chọn:** Redis được sử dụng cho caching và session storage. Với in-memory storage, Redis có performance cực kỳ nhanh, phù hợp cho caching frequently accessed data như user sessions, product cache.

#### JWT Authentication
**Lý do chọn:** JWT cung cấp stateless authentication, không cần lưu session trên server. Điều này giúp hệ thống có thể scale horizontally dễ dàng.

#### Socket.IO
**Lý do chọn:** Socket.IO cung cấp real-time communication cho features như order tracking, live chat, và notifications. Hỗ trợ fallback mechanisms cho các browser cũ.

### Frontend Technologies

#### Next.js 15
**Lý do chọn:** Next.js là React framework với nhiều optimizations built-in như server-side rendering, static generation, và automatic code splitting. Version 15 có App Router mới với performance tốt hơn.

#### Tailwind CSS
**Lý do chọn:** Tailwind CSS cung cấp utility-first approach, giúp styling nhanh và consistent. Không cần viết custom CSS, giảm bundle size với purging unused styles.

#### shadcn/ui
**Lý do chọn:** shadcn/ui là component library built on top of Radix UI, cung cấp accessible và customizable components. Không phải là npm package mà là copy-paste components, cho phép full customization.

#### React Query (TanStack Query)
**Lý do chọn:** React Query cung cấp powerful state management cho server state với caching, background updates, và optimistic updates. Giảm boilerplate code cho data fetching.

#### Zod
**Lý do chọn:** Zod cung cấp runtime type validation với TypeScript integration. Đảm bảo data validation ở cả client và server side với cùng schema.

## Cấu trúc dự án chi tiết

```
node-ecommerce/
├── apps/
│   ├── backend/                    # Backend API
│   │   ├── src/
│   │   │   ├── modules/            # Business modules
│   │   │   │   ├── auth/           # Authentication module
│   │   │   │   ├── user/           # User management
│   │   │   │   ├── product/        # Product catalog
│   │   │   │   ├── category/       # Category management
│   │   │   │   ├── cart/           # Shopping cart
│   │   │   │   ├── order/          # Order management
│   │   │   │   ├── payment/        # Payment processing
│   │   │   │   ├── inventory/      # Inventory management
│   │   │   │   └── dashboard/      # Admin dashboard
│   │   │   ├── core/               # Shared utilities
│   │   │   ├── config/             # Configuration
│   │   │   └── common/             # Middleware
│   │   ├── prisma/                 # Database schema
│   │   └── tests/                  # Test files
│   └── frontend/                   # Next.js frontend
│       ├── src/
│       │   ├── app/                # App Router pages
│       │   ├── features/           # Feature components
│       │   ├── components/         # UI components
│       │   ├── hooks/              # Custom hooks
│       │   ├── lib/                # Utilities
│       │   └── shared/             # Shared types
│       └── public/                 # Static assets
├── docs/                           # Documentation
├── scripts/                        # Build và deployment scripts
├── docker-compose.yml              # Development environment
└── package.json                    # Workspace configuration
```

## Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 20.x trở lên
- npm hoặc yarn
- PostgreSQL 17.x
- Redis 7.x (optional cho development)

### Bước 1: Clone và cài đặt

```bash
git clone <repository-url>
cd node-ecommerce
npm install
```

### Bước 2: Cấu hình môi trường

```bash
# Backend environment
cd apps/backend
cp .env.example .env

# Frontend environment
cd ../frontend
cp .env.example .env.local
```

### Bước 3: Khởi động services

```bash
# Khởi động PostgreSQL và Redis với Docker
docker-compose up -d

# Chạy database migrations
cd apps/backend
npm run db:migrate

# Seed dữ liệu mẫu
npm run db:seed
```

### Bước 4: Chạy ứng dụng

```bash
# Từ thư mục root - chạy cả backend và frontend
npm run dev

# Hoặc chạy riêng từng service
npm run dev:backend    # Backend trên port 3001
npm run dev:frontend   # Frontend trên port 3000
```

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # Đăng ký tài khoản mới
POST /api/auth/login        # Đăng nhập
POST /api/auth/logout       # Đăng xuất
POST /api/auth/refresh      # Refresh access token
```

### Product Management

```
GET    /api/products        # Lấy danh sách sản phẩm với pagination
GET    /api/products/:id    # Chi tiết sản phẩm
POST   /api/products        # Tạo sản phẩm mới (Admin)
PUT    /api/products/:id    # Cập nhật sản phẩm (Admin)
DELETE /api/products/:id    # Xóa sản phẩm (Admin)
```

### Order Management

```
GET    /api/orders          # Lấy đơn hàng của user
POST   /api/orders          # Tạo đơn hàng mới
GET    /api/orders/:id      # Chi tiết đơn hàng
GET    /api/admin/orders    # Tất cả đơn hàng (Admin)
PUT    /api/admin/orders/:id # Cập nhật trạng thái đơn hàng
```

### Cart Operations

```
GET    /api/cart            # Lấy giỏ hàng hiện tại
POST   /api/cart/add        # Thêm sản phẩm vào giỏ hàng
PUT    /api/cart/items/:id  # Cập nhật số lượng
DELETE /api/cart/items/:id  # Xóa sản phẩm khỏi giỏ hàng
DELETE /api/cart            # Xóa toàn bộ giỏ hàng
```

## Development Workflow

### Code Organization Principles

1. **Single Responsibility**: Mỗi file chỉ có một trách nhiệm duy nhất
2. **Dependency Injection**: Sử dụng DI containers để quản lý dependencies
3. **Interface Segregation**: Mỗi interface chỉ định nghĩa methods cần thiết
4. **Open/Closed Principle**: Mở rộng functionality thông qua composition

### Testing Strategy

- **Unit Tests**: Test individual functions và classes
- **Integration Tests**: Test API endpoints và database operations
- **E2E Tests**: Test complete user workflows

### Code Quality

- **ESLint**: Code linting với TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Jest**: Testing framework

## Performance Considerations

### Backend Optimization

- **Database Indexing**: Proper indexes cho frequently queried fields
- **Query Optimization**: Sử dụng Prisma query optimization
- **Caching**: Redis caching cho expensive operations
- **Connection Pooling**: Database connection pooling
- **Rate Limiting**: API rate limiting để prevent abuse

### Frontend Optimization

- **Code Splitting**: Automatic code splitting với Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Regular bundle size monitoring
- **Lazy Loading**: Lazy load components và routes
- **Service Worker**: Caching strategies

## Security Measures

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt với salt rounds
- **Role-based Access**: Admin và user roles
- **Session Management**: Secure session handling

### API Security

- **CORS Configuration**: Proper CORS setup
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Zod validation cho tất cả inputs
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Protection**: Helmet.js security headers

### Data Protection

- **Environment Variables**: Sensitive data trong environment variables
- **HTTPS Only**: Force HTTPS trong production
- **Data Encryption**: Encrypt sensitive data at rest
- **Audit Logging**: Log security events

## Deployment Strategy

### Development Environment

- **Docker Compose**: Local development với PostgreSQL và Redis
- **Hot Reload**: Automatic reload khi code changes
- **Debug Mode**: Full debugging capabilities

### Production Environment

- **Containerization**: Docker containers cho consistency
- **Load Balancing**: Multiple instances với load balancer
- **Database Clustering**: PostgreSQL clustering cho high availability
- **CDN**: Static assets delivery qua CDN
- **Monitoring**: Application và infrastructure monitoring

## Monitoring và Logging

### Application Monitoring

- **Winston Logging**: Structured logging với different levels
- **Error Tracking**: Comprehensive error handling và reporting
- **Performance Metrics**: Response time và throughput monitoring
- **Health Checks**: Application health endpoints

### Infrastructure Monitoring

- **Database Monitoring**: Query performance và connection monitoring
- **Redis Monitoring**: Cache hit rates và memory usage
- **Server Metrics**: CPU, memory, và disk usage
- **Network Monitoring**: API response times và availability

## Future Enhancements

### Planned Features

- **Payment Integration**: Stripe, PayPal, và local payment methods
- **Email Notifications**: Transactional emails với templates
- **Search Functionality**: Full-text search với Elasticsearch
- **Analytics Dashboard**: Business metrics và reporting
- **Mobile App**: React Native mobile application
- **Multi-language Support**: Internationalization
- **Advanced Inventory**: Barcode scanning và warehouse management

### Technical Improvements

- **Microservices**: Split into smaller, focused services
- **Event Sourcing**: Event-driven architecture cho scalability
- **GraphQL API**: Flexible data fetching
- **Real-time Analytics**: Live dashboard với WebSocket
- **Machine Learning**: Product recommendations và fraud detection

## Contributing

### Development Guidelines

1. **Branch Strategy**: Feature branches với pull request workflow
2. **Code Review**: Mandatory code review cho tất cả changes
3. **Testing**: Maintain test coverage above 80%
4. **Documentation**: Update documentation với code changes
5. **Commit Messages**: Conventional commit format

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Enforced code style
- **Prettier**: Consistent formatting
- **Git Hooks**: Pre-commit hooks cho quality checks

## License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Support

Để được hỗ trợ hoặc báo cáo issues, vui lòng tạo issue trên GitHub repository hoặc liên hệ development team.
