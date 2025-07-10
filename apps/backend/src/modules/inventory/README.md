# Inventory Module

Module quản lý kho hàng (inventory) cho hệ thống e-commerce.

## Tính năng

### 1. Quản lý Inventory
- Tạo, cập nhật, xóa inventory cho sản phẩm
- Theo dõi số lượng tồn kho (total, available, reserved)
- Quản lý thông tin warehouse, location, batch
- Thiết lập ngưỡng cảnh báo hết hàng
- Hỗ trợ backorder và reorder

### 2. Quản lý Stock
- Nhập/Xuất kho với các loại movement khác nhau
- Reserve/Release stock cho đơn hàng
- Điều chỉnh stock với lý do cụ thể
- Tracking chi tiết lịch sử movement

### 3. Alerts & Monitoring
- Cảnh báo hết hàng (low stock, out of stock)
- Cảnh báo hàng hết hạn
- Theo dõi giá trị tồn kho

## Cấu trúc

```
inventory/
├── domain/
│   ├── entities/
│   │   └── inventory.entity.ts      # Domain entities
│   └── interfaces/
│       └── inventory-repository.interface.ts
├── application/
│   ├── dto/
│   │   └── inventory.dto.ts         # DTOs và validation
│   └── use-cases/
│       ├── create-inventory.usecase.ts
│       ├── get-inventory-by-id.usecase.ts
│       ├── get-all-inventories.usecase.ts
│       ├── update-inventory.usecase.ts
│       ├── update-stock.usecase.ts
│       ├── reserve-stock.usecase.ts
│       └── check-availability.usecase.ts
├── infrastructure/
│   └── repositories/
│       └── inventory.repository.ts  # Prisma implementation
├── presentation/
│   └── controllers/
│       └── inventory.controller.ts  # REST API endpoints
├── container.ts                     # Dependency injection
├── routes.ts                       # Route definitions
└── index.ts                        # Module exports
```

## API Endpoints

### Inventory Management
- `GET /api/inventory` - Lấy danh sách inventory (có phân trang, filter)
- `GET /api/inventory/:id` - Lấy inventory theo ID
- `POST /api/inventory` - Tạo inventory mới
- `PUT /api/inventory/:id` - Cập nhật inventory

### Stock Management
- `POST /api/inventory/:id/stock` - Cập nhật stock (nhập/xuất/điều chỉnh)
- `POST /api/inventory/reserve` - Reserve stock cho đơn hàng
- `POST /api/inventory/release` - Release reserved stock

## Sử dụng

### 1. Tạo Inventory
```json
POST /api/inventory
{
  "productId": "uuid",
  "sku": "PROD-001",
  "totalQuantity": 100,
  "lowStockThreshold": 10,
  "reorderPoint": 20,
  "reorderQuantity": 50,
  "unitCost": 25.50,
  "location": "A1-B2",
  "allowBackorder": true,
  "backorderLimit": 20
}
```

### 2. Cập nhật Stock
```json
POST /api/inventory/:id/stock
{
  "quantity": 50,
  "type": "STOCK_IN",
  "reason": "Purchase order received",
  "referenceId": "PO-12345",
  "referenceType": "PURCHASE_ORDER",
  "unitCost": 25.00
}
```

### 3. Reserve Stock
```json
POST /api/inventory/reserve
{
  "productId": "uuid",
  "quantity": 5,
  "referenceId": "ORDER-12345",
  "referenceType": "ORDER",
  "reason": "Order placement"
}
```

## Business Logic

### Stock Movement Types
- `STOCK_IN`: Nhập kho
- `STOCK_OUT`: Xuất kho
- `ADJUSTMENT`: Điều chỉnh
- `RESERVATION`: Đặt chỗ
- `RELEASE`: Giải phóng
- `TRANSFER`: Chuyển kho
- `DAMAGE`: Hư hỏng
- `RETURN`: Trả hàng

### Alert Types
- `LOW_STOCK`: Sắp hết hàng
- `OUT_OF_STOCK`: Hết hàng
- `EXPIRED`: Đã hết hạn
- `NEAR_EXPIRY`: Sắp hết hạn

## Tích hợp với Module khác

### Product Module
- Inventory được liên kết với Product thông qua `productId`
- Cung cấp thông tin availability cho product listing

### Order Module
- Reserve stock khi tạo order
- Release stock khi hủy order
- Confirm stock movement khi fulfill order

### Warehouse Module (Future)
- Quản lý inventory theo warehouse
- Transfer stock giữa các warehouse

## Database Schema

Module này yêu cầu các bảng database:
- `inventory` - Thông tin inventory chính
- `inventory_movements` - Lịch sử movement
- `inventory_alerts` - Cảnh báo và thông báo

Chi tiết schema sẽ được implement trong Prisma migrations.

## Notes

- Repository implementation hiện tại chỉ có basic methods
- Cần implement đầy đủ các methods trong IInventoryRepository
- Cần tạo Prisma schema cho inventory tables
- Module tuân thủ Clean Architecture và giới hạn 100 dòng code/file 