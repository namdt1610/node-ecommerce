const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const iphoneDataPart3 = [
    // iPhone XS Max
    {
        name: 'iPhone XS Max',
        slug: 'iphone-xs-max',
        brand: 'Apple',
        model: 'iPhone XS Max',
        sku: 'IPHONE-XS-MAX-64GB',
        description:
            'iPhone XS Max với màn hình OLED 6.5 inch lớn nhất từ trước đến nay.',
        shortDescription: 'iPhone với màn hình lớn nhất 6.5 inch',
        price: 68000000,
        originalPrice: 85000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-xs-max.jpg']),
        specifications: JSON.stringify({
            display: '6.5-inch Super Retina OLED',
            resolution: '1242 x 2688 pixels',
            processor: 'Apple A12 Bionic hexa-core',
            storage: '64GB/256GB/512GB',
            camera: 'Dual 12MP rear with OIS, 7MP TrueDepth front',
            battery: '3174 mAh',
            os: 'iOS 12.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 11
    {
        name: 'iPhone 11',
        slug: 'iphone-11',
        brand: 'Apple',
        model: 'iPhone 11',
        sku: 'IPHONE-11-64GB',
        description:
            'iPhone 11 với camera kép, Night mode và pin lâu hơn với giá phải chăng.',
        shortDescription: 'iPhone với Night mode và giá tốt',
        price: 52000000,
        originalPrice: 65000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-11.jpg']),
        specifications: JSON.stringify({
            display: '6.1-inch Liquid Retina LCD',
            resolution: '828 x 1792 pixels',
            processor: 'Apple A13 Bionic hexa-core',
            storage: '64GB/128GB/256GB',
            camera: 'Dual 12MP rear (Wide, Ultra Wide), 12MP TrueDepth front',
            battery: '3110 mAh',
            os: 'iOS 13.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 11 Pro
    {
        name: 'iPhone 11 Pro',
        slug: 'iphone-11-pro',
        brand: 'Apple',
        model: 'iPhone 11 Pro',
        sku: 'IPHONE-11-PRO-64GB',
        description:
            'iPhone 11 Pro với hệ thống camera ba ống kính Pro và màn hình Super Retina XDR.',
        shortDescription: 'iPhone Pro với camera ba ống kính',
        price: 68000000,
        originalPrice: 85000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-11-pro.jpg']),
        specifications: JSON.stringify({
            display: '5.8-inch Super Retina XDR OLED',
            resolution: '1125 x 2436 pixels',
            processor: 'Apple A13 Bionic hexa-core',
            storage: '64GB/256GB/512GB',
            camera: 'Triple 12MP rear (Wide, Ultra Wide, Telephoto), 12MP TrueDepth front',
            battery: '3046 mAh',
            os: 'iOS 13.0',
        }),
        isActive: true,
    },

    // iPhone 11 Pro Max
    {
        name: 'iPhone 11 Pro Max',
        slug: 'iphone-11-pro-max',
        brand: 'Apple',
        model: 'iPhone 11 Pro Max',
        sku: 'IPHONE-11-PRO-MAX-64GB',
        description:
            'iPhone 11 Pro Max với camera ba ống kính Pro và pin khủng nhất.',
        shortDescription: 'iPhone Pro Max với pin lâu nhất',
        price: 75000000,
        originalPrice: 95000000,
        discount: 21,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-11-pro-max.jpg']),
        specifications: JSON.stringify({
            display: '6.5-inch Super Retina XDR OLED',
            resolution: '1242 x 2688 pixels',
            processor: 'Apple A13 Bionic hexa-core',
            storage: '64GB/256GB/512GB',
            camera: 'Triple 12MP rear (Wide, Ultra Wide, Telephoto), 12MP TrueDepth front',
            battery: '3969 mAh',
            os: 'iOS 13.0',
        }),
        isActive: true,
    },

    // iPhone SE (2nd gen)
    {
        name: 'iPhone SE (2020)',
        slug: 'iphone-se-2020',
        brand: 'Apple',
        model: 'iPhone SE',
        sku: 'IPHONE-SE-2020-64GB',
        description:
            'iPhone SE 2020 với chip A13 Bionic mạnh mẽ trong thân hình cổ điển.',
        shortDescription: 'iPhone SE với chip A13 Bionic',
        price: 32000000,
        originalPrice: 40000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-se-2020.jpg']),
        specifications: JSON.stringify({
            display: '4.7-inch Retina LCD',
            resolution: '750 x 1334 pixels',
            processor: 'Apple A13 Bionic hexa-core',
            storage: '64GB/128GB/256GB',
            camera: '12MP rear with OIS, 7MP front',
            battery: '1821 mAh',
            os: 'iOS 13.0',
        }),
        isActive: true,
    },

    // iPhone 12 mini
    {
        name: 'iPhone 12 mini',
        slug: 'iphone-12-mini',
        brand: 'Apple',
        model: 'iPhone 12 mini',
        sku: 'IPHONE-12-MINI-64GB',
        description:
            'iPhone 12 mini nhỏ gọn với 5G, chip A14 Bionic và màn hình Super Retina XDR.',
        shortDescription: 'iPhone nhỏ gọn với 5G',
        price: 58000000,
        originalPrice: 72000000,
        discount: 19,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-12-mini.jpg']),
        specifications: JSON.stringify({
            display: '5.4-inch Super Retina XDR OLED',
            resolution: '1080 x 2340 pixels',
            processor: 'Apple A14 Bionic hexa-core',
            storage: '64GB/128GB/256GB',
            camera: 'Dual 12MP rear (Wide, Ultra Wide), 12MP TrueDepth front',
            battery: '2227 mAh',
            os: 'iOS 14.0',
        }),
        isActive: true,
    },

    // iPhone 12
    {
        name: 'iPhone 12',
        slug: 'iphone-12',
        brand: 'Apple',
        model: 'iPhone 12',
        sku: 'IPHONE-12-64GB',
        description:
            'iPhone 12 với 5G, chip A14 Bionic và thiết kế vuông vức hiện đại.',
        shortDescription: 'iPhone với 5G và thiết kế mới',
        price: 65000000,
        originalPrice: 82000000,
        discount: 21,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-12.jpg']),
        specifications: JSON.stringify({
            display: '6.1-inch Super Retina XDR OLED',
            resolution: '1170 x 2532 pixels',
            processor: 'Apple A14 Bionic hexa-core',
            storage: '64GB/128GB/256GB',
            camera: 'Dual 12MP rear (Wide, Ultra Wide), 12MP TrueDepth front',
            battery: '2815 mAh',
            os: 'iOS 14.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 12 Pro
    {
        name: 'iPhone 12 Pro',
        slug: 'iphone-12-pro',
        brand: 'Apple',
        model: 'iPhone 12 Pro',
        sku: 'IPHONE-12-PRO-128GB',
        description:
            'iPhone 12 Pro với camera ba ống kính Pro, LiDAR Scanner và khung thép không gỉ.',
        shortDescription: 'iPhone Pro với LiDAR Scanner',
        price: 78000000,
        originalPrice: 98000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-12-pro.jpg']),
        specifications: JSON.stringify({
            display: '6.1-inch Super Retina XDR OLED',
            resolution: '1170 x 2532 pixels',
            processor: 'Apple A14 Bionic hexa-core',
            storage: '128GB/256GB/512GB',
            camera: 'Triple 12MP rear (Wide, Ultra Wide, Telephoto) + LiDAR, 12MP TrueDepth front',
            battery: '2815 mAh',
            os: 'iOS 14.0',
        }),
        isActive: true,
    },

    // iPhone 12 Pro Max
    {
        name: 'iPhone 12 Pro Max',
        slug: 'iphone-12-pro-max',
        brand: 'Apple',
        model: 'iPhone 12 Pro Max',
        sku: 'IPHONE-12-PRO-MAX-128GB',
        description:
            'iPhone 12 Pro Max với màn hình lớn nhất, camera Pro Max và pin lâu nhất.',
        shortDescription: 'iPhone Pro Max lớn nhất',
        price: 88000000,
        originalPrice: 112000000,
        discount: 21,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-12-pro-max.jpg']),
        specifications: JSON.stringify({
            display: '6.7-inch Super Retina XDR OLED',
            resolution: '1284 x 2778 pixels',
            processor: 'Apple A14 Bionic hexa-core',
            storage: '128GB/256GB/512GB',
            camera: 'Triple 12MP rear (Wide, Ultra Wide, Telephoto) + LiDAR, 12MP TrueDepth front',
            battery: '3687 mAh',
            os: 'iOS 14.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 13 mini
    {
        name: 'iPhone 13 mini',
        slug: 'iphone-13-mini',
        brand: 'Apple',
        model: 'iPhone 13 mini',
        sku: 'IPHONE-13-MINI-128GB',
        description:
            'iPhone 13 mini với chip A15 Bionic, camera cải tiến và pin lâu hơn.',
        shortDescription: 'iPhone mini với A15 Bionic',
        price: 68000000,
        originalPrice: 85000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-13-mini.jpg']),
        specifications: JSON.stringify({
            display: '5.4-inch Super Retina XDR OLED',
            resolution: '1080 x 2340 pixels',
            processor: 'Apple A15 Bionic hexa-core',
            storage: '128GB/256GB/512GB',
            camera: 'Dual 12MP rear (Wide, Ultra Wide), 12MP TrueDepth front',
            battery: '2438 mAh',
            os: 'iOS 15.0',
        }),
        isActive: true,
    },
]

async function seedIPhonesPart3() {
    try {
        console.log(
            '🍎 Bắt đầu seed dữ liệu iPhone Part 3 (XS Max - 13 mini)...'
        )

        // Tìm category iPhone
        const iphoneCategory = await prisma.category.findFirst({
            where: { name: 'iPhone' },
        })

        if (!iphoneCategory) {
            console.error(
                '❌ Không tìm thấy category iPhone. Vui lòng chạy script part 1 trước.'
            )
            return
        }

        // Seed từng iPhone
        for (const iphone of iphoneDataPart3) {
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

        console.log('🎉 Hoàn thành seed dữ liệu iPhone Part 3!')
        console.log(`📱 Đã thêm ${iphoneDataPart3.length} model iPhone`)
    } catch (error) {
        console.error('❌ Lỗi khi seed iPhone Part 3:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Chạy script
seedIPhonesPart3()
