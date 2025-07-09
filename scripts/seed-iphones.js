const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const iphoneData = [
    // iPhone Original Series
    {
        name: 'iPhone (Original)',
        slug: 'iphone-original',
        brand: 'Apple',
        model: 'iPhone',
        sku: 'IPHONE-2G-4GB',
        description:
            'Chiếc iPhone đầu tiên cách mạng hóa ngành công nghệ di động với màn hình cảm ứng đa điểm và giao diện trực quan.',
        shortDescription: 'iPhone đầu tiên của Apple',
        price: 15000000,
        originalPrice: 18000000,
        discount: 15,
        productType: 'SMARTPHONE',
        condition: 'REFURBISHED',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-original.jpg']),
        specifications: JSON.stringify({
            display: '3.5-inch LCD',
            resolution: '320 x 480 pixels',
            processor: 'Samsung 32-bit RISC ARM 1176JZ(F)-S v1.0',
            storage: '4GB/8GB/16GB',
            camera: '2MP rear',
            battery: '1150 mAh',
            os: 'iPhone OS 1.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 3G
    {
        name: 'iPhone 3G',
        slug: 'iphone-3g',
        brand: 'Apple',
        model: 'iPhone 3G',
        sku: 'IPHONE-3G-8GB',
        description:
            'iPhone 3G mang đến kết nối 3G nhanh chóng và App Store - cửa hàng ứng dụng đầu tiên.',
        shortDescription: 'iPhone với kết nối 3G và App Store',
        price: 8000000,
        originalPrice: 10000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'REFURBISHED',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-3g.jpg']),
        specifications: JSON.stringify({
            display: '3.5-inch LCD',
            resolution: '320 x 480 pixels',
            processor: 'Samsung S5L8900 620 MHz',
            storage: '8GB/16GB',
            camera: '2MP rear',
            battery: '1150 mAh',
            os: 'iPhone OS 2.0',
        }),
        isActive: true,
    },

    // iPhone 3GS
    {
        name: 'iPhone 3GS',
        slug: 'iphone-3gs',
        brand: 'Apple',
        model: 'iPhone 3GS',
        sku: 'IPHONE-3GS-16GB',
        description:
            'iPhone 3GS với tốc độ nhanh gấp đôi, camera 3MP và khả năng quay video.',
        shortDescription: 'iPhone nhanh gấp đôi với camera video',
        price: 9000000,
        originalPrice: 12000000,
        discount: 25,
        productType: 'SMARTPHONE',
        condition: 'REFURBISHED',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-3gs.jpg']),
        specifications: JSON.stringify({
            display: '3.5-inch LCD',
            resolution: '320 x 480 pixels',
            processor: 'Samsung S5PC100 600 MHz',
            storage: '8GB/16GB/32GB',
            camera: '3MP rear with video recording',
            battery: '1200 mAh',
            os: 'iPhone OS 3.0',
        }),
        isActive: true,
    },

    // iPhone 4
    {
        name: 'iPhone 4',
        slug: 'iphone-4',
        brand: 'Apple',
        model: 'iPhone 4',
        sku: 'IPHONE-4-16GB',
        description:
            'iPhone 4 với thiết kế thép không gỉ, màn hình Retina và camera trước đầu tiên.',
        shortDescription: 'iPhone với màn hình Retina và FaceTime',
        price: 12000000,
        originalPrice: 15000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'REFURBISHED',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-4.jpg']),
        specifications: JSON.stringify({
            display: '3.5-inch Retina LCD',
            resolution: '640 x 960 pixels',
            processor: 'Apple A4 1 GHz',
            storage: '8GB/16GB/32GB',
            camera: '5MP rear, VGA front',
            battery: '1420 mAh',
            os: 'iOS 4.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 4S
    {
        name: 'iPhone 4S',
        slug: 'iphone-4s',
        brand: 'Apple',
        model: 'iPhone 4S',
        sku: 'IPHONE-4S-16GB',
        description:
            'iPhone 4S giới thiệu Siri - trợ lý ảo thông minh và camera 8MP chất lượng cao.',
        shortDescription: 'iPhone với Siri và camera 8MP',
        price: 14000000,
        originalPrice: 18000000,
        discount: 22,
        productType: 'SMARTPHONE',
        condition: 'REFURBISHED',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-4s.jpg']),
        specifications: JSON.stringify({
            display: '3.5-inch Retina LCD',
            resolution: '640 x 960 pixels',
            processor: 'Apple A5 dual-core 1 GHz',
            storage: '8GB/16GB/32GB/64GB',
            camera: '8MP rear, VGA front',
            battery: '1432 mAh',
            os: 'iOS 5.0',
        }),
        isActive: true,
    },

    // iPhone 5
    {
        name: 'iPhone 5',
        slug: 'iphone-5',
        brand: 'Apple',
        model: 'iPhone 5',
        sku: 'IPHONE-5-16GB',
        description:
            'iPhone 5 với màn hình 4 inch, thiết kế mỏng nhẹ và kết nối 4G LTE.',
        shortDescription: 'iPhone mỏng nhẹ với màn hình 4 inch',
        price: 16000000,
        originalPrice: 20000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'REFURBISHED',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-5.jpg']),
        specifications: JSON.stringify({
            display: '4-inch Retina LCD',
            resolution: '640 x 1136 pixels',
            processor: 'Apple A6 dual-core 1.3 GHz',
            storage: '16GB/32GB/64GB',
            camera: '8MP rear, 1.2MP front',
            battery: '1440 mAh',
            os: 'iOS 6.0',
        }),
        isActive: true,
    },

    // iPhone 5c
    {
        name: 'iPhone 5c',
        slug: 'iphone-5c',
        brand: 'Apple',
        model: 'iPhone 5c',
        sku: 'IPHONE-5C-16GB',
        description:
            'iPhone 5c với vỏ nhựa đầy màu sắc, giá cả phải chăng và hiệu năng ổn định.',
        shortDescription: 'iPhone đầy màu sắc với giá phải chăng',
        price: 15000000,
        originalPrice: 18000000,
        discount: 17,
        productType: 'SMARTPHONE',
        condition: 'REFURBISHED',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-5c.jpg']),
        specifications: JSON.stringify({
            display: '4-inch Retina LCD',
            resolution: '640 x 1136 pixels',
            processor: 'Apple A6 dual-core 1.3 GHz',
            storage: '8GB/16GB/32GB',
            camera: '8MP rear, 1.2MP front',
            battery: '1510 mAh',
            os: 'iOS 7.0',
        }),
        isActive: true,
    },

    // iPhone 5s
    {
        name: 'iPhone 5s',
        slug: 'iphone-5s',
        brand: 'Apple',
        model: 'iPhone 5s',
        sku: 'IPHONE-5S-16GB',
        description:
            'iPhone 5s với Touch ID - cảm biến vân tay đầu tiên và chip A7 64-bit.',
        shortDescription: 'iPhone đầu tiên với Touch ID',
        price: 18000000,
        originalPrice: 22000000,
        discount: 18,
        productType: 'SMARTPHONE',
        condition: 'REFURBISHED',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-5s.jpg']),
        specifications: JSON.stringify({
            display: '4-inch Retina LCD',
            resolution: '640 x 1136 pixels',
            processor: 'Apple A7 dual-core 1.3 GHz (64-bit)',
            storage: '16GB/32GB/64GB',
            camera: '8MP rear, 1.2MP front',
            battery: '1560 mAh',
            os: 'iOS 7.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 6
    {
        name: 'iPhone 6',
        slug: 'iphone-6',
        brand: 'Apple',
        model: 'iPhone 6',
        sku: 'IPHONE-6-64GB',
        description:
            'iPhone 6 với màn hình 4.7 inch lớn hơn, thiết kế mỏng và hiệu năng mạnh mẽ.',
        shortDescription: 'iPhone với màn hình 4.7 inch',
        price: 22000000,
        originalPrice: 28000000,
        discount: 21,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-6.jpg']),
        specifications: JSON.stringify({
            display: '4.7-inch Retina LCD',
            resolution: '750 x 1334 pixels',
            processor: 'Apple A8 dual-core 1.4 GHz',
            storage: '16GB/64GB/128GB',
            camera: '8MP rear, 1.2MP front',
            battery: '1810 mAh',
            os: 'iOS 8.0',
        }),
        isActive: true,
    },

    // iPhone 6 Plus
    {
        name: 'iPhone 6 Plus',
        slug: 'iphone-6-plus',
        brand: 'Apple',
        model: 'iPhone 6 Plus',
        sku: 'IPHONE-6-PLUS-64GB',
        description:
            'iPhone 6 Plus với màn hình 5.5 inch khổng lồ và pin lâu hơn.',
        shortDescription: 'iPhone phablet đầu tiên với màn hình 5.5 inch',
        price: 25000000,
        originalPrice: 32000000,
        discount: 22,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-6-plus.jpg']),
        specifications: JSON.stringify({
            display: '5.5-inch Retina LCD',
            resolution: '1080 x 1920 pixels',
            processor: 'Apple A8 dual-core 1.4 GHz',
            storage: '16GB/64GB/128GB',
            camera: '8MP rear with OIS, 1.2MP front',
            battery: '2915 mAh',
            os: 'iOS 8.0',
        }),
        isActive: true,
    },
]

async function seedIPhones() {
    try {
        console.log('🍎 Bắt đầu seed dữ liệu iPhone...')

        // Tìm hoặc tạo category cho iPhone
        let iphoneCategory = await prisma.category.findFirst({
            where: { name: 'iPhone' },
        })

        if (!iphoneCategory) {
            iphoneCategory = await prisma.category.create({
                data: {
                    name: 'iPhone',
                    slug: 'iphone',
                    description: 'Dòng điện thoại thông minh cao cấp của Apple',
                    imageUrl: '/images/categories/iphone.jpg',
                    isActive: true,
                },
            })
            console.log('✅ Đã tạo category iPhone')
        }

        // Seed từng iPhone
        for (const iphone of iphoneData) {
            const existingPhone = await prisma.product.findFirst({
                where: { sku: iphone.sku },
            })

            if (!existingPhone) {
                await prisma.product.create({
                    data: {
                        ...iphone,
                        categoryId: iphoneCategory.id,
                        currency: 'VND',
                    },
                })
                console.log(`✅ Đã thêm ${iphone.name}`)
            } else {
                console.log(`⚠️  ${iphone.name} đã tồn tại`)
            }
        }

        console.log('🎉 Hoàn thành seed dữ liệu iPhone!')
        console.log(`📱 Đã thêm ${iphoneData.length} model iPhone`)
    } catch (error) {
        console.error('❌ Lỗi khi seed iPhone:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Chạy script
seedIPhones()
