# 🍎 iPhone Seed Scripts - Hướng dẫn sử dụng

## Tổng quan

Bộ script seed này sẽ thêm **TẤT CẢ** các dòng iPhone từ iPhone đầu tiên (2007) đến iPhone 15 Pro Max (2023) vào database của bạn với dữ liệu chính xác và đầy đủ.

## Danh sách iPhone được seed

### 📱 iPhone Classic Series (2007-2012)
- iPhone Original (2007)
- iPhone 3G (2008) 
- iPhone 3GS (2009)
- iPhone 4 (2010)
- iPhone 4S (2011)
- iPhone 5 (2012)

### 📱 iPhone 5 Series (2013-2015)
- iPhone 5c (2013)
- iPhone 5s (2013)
- iPhone 6 & 6 Plus (2014)
- iPhone 6s & 6s Plus (2015)
- iPhone SE 1st gen (2016)

### 📱 iPhone 7-X Series (2016-2018)
- iPhone 7 & 7 Plus (2016)
- iPhone 8 & 8 Plus (2017)
- iPhone X (2017)
- iPhone XR, XS & XS Max (2018)

### 📱 iPhone 11-15 Series (2019-2023)
- iPhone 11, 11 Pro & 11 Pro Max (2019)
- iPhone SE 2nd gen (2020)
- iPhone 12 mini, 12, 12 Pro & 12 Pro Max (2020)
- iPhone 13 mini, 13, 13 Pro & 13 Pro Max (2021)
- iPhone SE 3rd gen (2022)
- iPhone 14, 14 Plus, 14 Pro & 14 Pro Max (2022)
- iPhone 15, 15 Plus, 15 Pro & 15 Pro Max (2023)

## Cách sử dụng

### Option 1: Seed tất cả cùng lúc (Khuyến nghị)

```bash
# Chạy tất cả script cùng lúc
npm run seed:iphones
```

### Option 2: Seed từng phần

```bash
# Part 1: iPhone Original đến iPhone 6 Plus  
npm run seed:iphones:part1

# Part 2: iPhone 6s đến iPhone XS
npm run seed:iphones:part2

# Part 3: iPhone XS Max đến iPhone 13 mini
npm run seed:iphones:part3

# Part 4: iPhone 13 đến iPhone 15 Pro Max
npm run seed:iphones:part4
```

### Option 3: Chạy trực tiếp

```bash
# Chạy tất cả
node scripts/seed-all-iphones.js

# Hoặc chạy từng script
node scripts/seed-iphones.js
node scripts/seed-iphones-part2.js
node scripts/seed-iphones-part3.js
node scripts/seed-iphones-part4.js
```

## Thông tin dữ liệu

### 💰 Giá cả
- **Khoảng giá**: 8 triệu VNĐ (iPhone 3G refurbished) → 145 triệu VNĐ (iPhone 15 Pro Max)
- **Giảm giá**: Tất cả đều có discount từ 15-25%
- **Điều kiện**: Bao gồm cả NEW và REFURBISHED

### 📝 Thông tin sản phẩm
- **Mô tả**: Tiếng Việt chi tiết cho từng model
- **Thông số kỹ thuật**: Đầy đủ và chính xác
- **SKU**: Unique cho mỗi model (ví dụ: IPHONE-15-PRO-MAX-256GB)
- **Slug**: SEO-friendly URLs
- **Category**: Tự động tạo category "iPhone" nếu chưa có

### 🖼️ Hình ảnh
- Đường dẫn hình ảnh chuẩn: `/images/iphones/iphone-{model}.jpg`
- Bạn cần upload hình ảnh thực tế vào thư mục tương ứng

## Lưu ý quan trọng

### ⚠️ Trước khi chạy
1. **Backup database** trước khi seed
2. Đảm bảo **Prisma** đã được setup đúng
3. Kiểm tra **connection string** database
4. Script sẽ **không ghi đè** nếu iPhone đã tồn tại (check by SKU)

### 🔄 Chạy lại
- Script có thể chạy nhiều lần an toàn
- Chỉ thêm iPhone chưa tồn tại
- Hiển thị warning cho iPhone đã có

### 📊 Thống kê sau khi seed
- Tổng số iPhone: **~37 models**
- Thời gian seed: **~30-60 giây**
- Dung lượng database: **~2-3MB** (chỉ data, không tính hình ảnh)

## Cấu trúc dữ liệu

```javascript
{
  name: "iPhone 15 Pro Max",
  slug: "iphone-15-pro-max",
  brand: "Apple",
  model: "iPhone 15 Pro Max", 
  sku: "IPHONE-15-PRO-MAX-256GB",
  description: "Mô tả chi tiết bằng tiếng Việt...",
  shortDescription: "Mô tả ngắn...",
  price: 145000000, // VNĐ
  originalPrice: 180000000,
  discount: 19,
  productType: "SMARTPHONE",
  condition: "NEW",
  status: "ACTIVE",
  images: ["/images/iphones/iphone-15-pro-max.jpg"],
  specifications: {
    display: "6.7-inch Super Retina XDR OLED...",
    processor: "Apple A17 Pro hexa-core (3nm)",
    storage: "256GB/512GB/1TB",
    camera: "Triple 48MP rear...",
    battery: "4441 mAh",
    os: "iOS 17.0"
  },
  isActive: true,
  isFeatured: true, // Chỉ một số model quan trọng
  categoryId: "auto-generated-iphone-category-id",
  currency: "VND"
}
```

## Troubleshooting

### ❌ Lỗi thường gặp

**Lỗi: "Category iPhone not found"**
```bash
# Chạy part 1 trước để tạo category
npm run seed:iphones:part1
```

**Lỗi: "Database connection failed"**
```bash
# Kiểm tra .env file
cat apps/backend/.env
# Đảm bảo DATABASE_URL đúng
```

**Lỗi: "Prisma not found"**
```bash
# Cài đặt dependencies
cd apps/backend
npm install
npx prisma generate
```

### 🔧 Debug mode
Thêm `console.log` trong script để debug:
```javascript
console.log('Current iPhone:', iphone.name)
console.log('Category ID:', iphoneCategory.id)
```

## Kết quả mong đợi

Sau khi chạy xong, bạn sẽ có:

✅ **37 iPhone models** trong database  
✅ **Category iPhone** được tạo tự động  
✅ **Dữ liệu chính xác** với giá VNĐ  
✅ **SEO-friendly slugs** cho URL  
✅ **Thông số kỹ thuật đầy đủ**  
✅ **Mô tả tiếng Việt chuyên nghiệp**  

## Liên hệ hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra log output
2. Đảm bảo database running
3. Verify Prisma schema
4. Check permissions

**Happy Seeding! 🍎📱✨** 