const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const iphoneDataPart4 = [
    // iPhone 13
    {
        name: 'iPhone 13',
        slug: 'iphone-13',
        brand: 'Apple',
        model: 'iPhone 13',
        sku: 'IPHONE-13-128GB',
        description:
            'iPhone 13 với chip A15 Bionic, camera kép cải tiến và pin lâu hơn 2.5 giờ.',
        shortDescription: 'iPhone với A15 Bionic và pin lâu hơn',
        price: 75000000,
        originalPrice: 95000000,
        discount: 21,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-13.jpg']),
        specifications: JSON.stringify({
            display: '6.1-inch Super Retina XDR OLED',
            resolution: '1170 x 2532 pixels',
            processor: 'Apple A15 Bionic hexa-core',
            storage: '128GB/256GB/512GB',
            camera: 'Dual 12MP rear (Wide, Ultra Wide), 12MP TrueDepth front',
            battery: '3227 mAh',
            os: 'iOS 15.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 13 Pro
    {
        name: 'iPhone 13 Pro',
        slug: 'iphone-13-pro',
        brand: 'Apple',
        model: 'iPhone 13 Pro',
        sku: 'IPHONE-13-PRO-128GB',
        description:
            'iPhone 13 Pro với màn hình ProMotion 120Hz, camera macro và video ProRes.',
        shortDescription: 'iPhone Pro với màn hình 120Hz',
        price: 92000000,
        originalPrice: 115000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-13-pro.jpg']),
        specifications: JSON.stringify({
            display: '6.1-inch Super Retina XDR OLED ProMotion 120Hz',
            resolution: '1170 x 2532 pixels',
            processor: 'Apple A15 Bionic hexa-core',
            storage: '128GB/256GB/512GB/1TB',
            camera: 'Triple 12MP rear (Wide, Ultra Wide, Telephoto, Macro) + LiDAR, 12MP TrueDepth front',
            battery: '3095 mAh',
            os: 'iOS 15.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 13 Pro Max
    {
        name: 'iPhone 13 Pro Max',
        slug: 'iphone-13-pro-max',
        brand: 'Apple',
        model: 'iPhone 13 Pro Max',
        sku: 'IPHONE-13-PRO-MAX-128GB',
        description:
            'iPhone 13 Pro Max với màn hình 6.7 inch ProMotion và pin lâu nhất từ trước đến nay.',
        shortDescription: 'iPhone Pro Max với pin khủng nhất',
        price: 105000000,
        originalPrice: 132000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-13-pro-max.jpg']),
        specifications: JSON.stringify({
            display: '6.7-inch Super Retina XDR OLED ProMotion 120Hz',
            resolution: '1284 x 2778 pixels',
            processor: 'Apple A15 Bionic hexa-core',
            storage: '128GB/256GB/512GB/1TB',
            camera: 'Triple 12MP rear (Wide, Ultra Wide, Telephoto, Macro) + LiDAR, 12MP TrueDepth front',
            battery: '4352 mAh',
            os: 'iOS 15.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone SE (3rd gen)
    {
        name: 'iPhone SE (2022)',
        slug: 'iphone-se-2022',
        brand: 'Apple',
        model: 'iPhone SE',
        sku: 'IPHONE-SE-2022-64GB',
        description:
            'iPhone SE 2022 với chip A15 Bionic, 5G và Touch ID trong thiết kế quen thuộc.',
        shortDescription: 'iPhone SE với 5G và A15 Bionic',
        price: 38000000,
        originalPrice: 48000000,
        discount: 21,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-se-2022.jpg']),
        specifications: JSON.stringify({
            display: '4.7-inch Retina LCD',
            resolution: '750 x 1334 pixels',
            processor: 'Apple A15 Bionic hexa-core',
            storage: '64GB/128GB/256GB',
            camera: '12MP rear with OIS, 7MP front',
            battery: '2018 mAh',
            os: 'iOS 15.4',
        }),
        isActive: true,
    },

    // iPhone 14
    {
        name: 'iPhone 14',
        slug: 'iphone-14',
        brand: 'Apple',
        model: 'iPhone 14',
        sku: 'IPHONE-14-128GB',
        description:
            'iPhone 14 với camera chính 48MP, Photonic Engine và tính năng Emergency SOS.',
        shortDescription: 'iPhone với camera 48MP',
        price: 82000000,
        originalPrice: 105000000,
        discount: 22,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-14.jpg']),
        specifications: JSON.stringify({
            display: '6.1-inch Super Retina XDR OLED',
            resolution: '1170 x 2532 pixels',
            processor: 'Apple A15 Bionic hexa-core',
            storage: '128GB/256GB/512GB',
            camera: 'Dual 12MP rear (48MP Wide, Ultra Wide), 12MP TrueDepth front',
            battery: '3279 mAh',
            os: 'iOS 16.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 14 Plus
    {
        name: 'iPhone 14 Plus',
        slug: 'iphone-14-plus',
        brand: 'Apple',
        model: 'iPhone 14 Plus',
        sku: 'IPHONE-14-PLUS-128GB',
        description:
            'iPhone 14 Plus với màn hình 6.7 inch lớn và pin lâu hơn iPhone 14.',
        shortDescription: 'iPhone Plus với màn hình lớn',
        price: 92000000,
        originalPrice: 118000000,
        discount: 22,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-14-plus.jpg']),
        specifications: JSON.stringify({
            display: '6.7-inch Super Retina XDR OLED',
            resolution: '1284 x 2778 pixels',
            processor: 'Apple A15 Bionic hexa-core',
            storage: '128GB/256GB/512GB',
            camera: 'Dual 12MP rear (48MP Wide, Ultra Wide), 12MP TrueDepth front',
            battery: '4325 mAh',
            os: 'iOS 16.0',
        }),
        isActive: true,
    },

    // iPhone 14 Pro
    {
        name: 'iPhone 14 Pro',
        slug: 'iphone-14-pro',
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        sku: 'IPHONE-14-PRO-128GB',
        description:
            'iPhone 14 Pro với Dynamic Island, camera 48MP Pro và chip A16 Bionic.',
        shortDescription: 'iPhone Pro với Dynamic Island',
        price: 108000000,
        originalPrice: 135000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-14-pro.jpg']),
        specifications: JSON.stringify({
            display:
                '6.1-inch Super Retina XDR OLED ProMotion 120Hz with Dynamic Island',
            resolution: '1179 x 2556 pixels',
            processor: 'Apple A16 Bionic hexa-core',
            storage: '128GB/256GB/512GB/1TB',
            camera: 'Triple 48MP rear (Wide, Ultra Wide, Telephoto) + LiDAR, 12MP TrueDepth front',
            battery: '3200 mAh',
            os: 'iOS 16.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 14 Pro Max
    {
        name: 'iPhone 14 Pro Max',
        slug: 'iphone-14-pro-max',
        brand: 'Apple',
        model: 'iPhone 14 Pro Max',
        sku: 'IPHONE-14-PRO-MAX-128GB',
        description:
            'iPhone 14 Pro Max với Dynamic Island, camera 48MP Pro và màn hình lớn nhất.',
        shortDescription: 'iPhone Pro Max với Dynamic Island',
        price: 122000000,
        originalPrice: 152000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-14-pro-max.jpg']),
        specifications: JSON.stringify({
            display:
                '6.7-inch Super Retina XDR OLED ProMotion 120Hz with Dynamic Island',
            resolution: '1290 x 2796 pixels',
            processor: 'Apple A16 Bionic hexa-core',
            storage: '128GB/256GB/512GB/1TB',
            camera: 'Triple 48MP rear (Wide, Ultra Wide, Telephoto) + LiDAR, 12MP TrueDepth front',
            battery: '4323 mAh',
            os: 'iOS 16.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 15
    {
        name: 'iPhone 15',
        slug: 'iphone-15',
        brand: 'Apple',
        model: 'iPhone 15',
        sku: 'IPHONE-15-128GB',
        description:
            'iPhone 15 với Dynamic Island, USB-C và camera 48MP với zoom 2x.',
        shortDescription: 'iPhone mới nhất với USB-C',
        price: 95000000,
        originalPrice: 120000000,
        discount: 21,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-15.jpg']),
        specifications: JSON.stringify({
            display: '6.1-inch Super Retina XDR OLED with Dynamic Island',
            resolution: '1179 x 2556 pixels',
            processor: 'Apple A16 Bionic hexa-core',
            storage: '128GB/256GB/512GB',
            camera: 'Dual 48MP rear (Wide, Ultra Wide), 12MP TrueDepth front',
            battery: '3349 mAh',
            os: 'iOS 17.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 15 Plus
    {
        name: 'iPhone 15 Plus',
        slug: 'iphone-15-plus',
        brand: 'Apple',
        model: 'iPhone 15 Plus',
        sku: 'IPHONE-15-PLUS-128GB',
        description:
            'iPhone 15 Plus với màn hình 6.7 inch, USB-C và pin lâu hơn iPhone 15.',
        shortDescription: 'iPhone Plus mới nhất',
        price: 108000000,
        originalPrice: 135000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-15-plus.jpg']),
        specifications: JSON.stringify({
            display: '6.7-inch Super Retina XDR OLED with Dynamic Island',
            resolution: '1290 x 2796 pixels',
            processor: 'Apple A16 Bionic hexa-core',
            storage: '128GB/256GB/512GB',
            camera: 'Dual 48MP rear (Wide, Ultra Wide), 12MP TrueDepth front',
            battery: '4383 mAh',
            os: 'iOS 17.0',
        }),
        isActive: true,
    },

    // iPhone 15 Pro
    {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        brand: 'Apple',
        model: 'iPhone 15 Pro',
        sku: 'IPHONE-15-PRO-128GB',
        description:
            'iPhone 15 Pro với chip A17 Pro, khung Titanium và Action Button thay thế mute switch.',
        shortDescription: 'iPhone Pro với chip A17 Pro',
        price: 125000000,
        originalPrice: 155000000,
        discount: 19,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-15-pro.jpg']),
        specifications: JSON.stringify({
            display:
                '6.1-inch Super Retina XDR OLED ProMotion 120Hz with Dynamic Island',
            resolution: '1179 x 2556 pixels',
            processor: 'Apple A17 Pro hexa-core (3nm)',
            storage: '128GB/256GB/512GB/1TB',
            camera: 'Triple 48MP rear (Wide, Ultra Wide, Telephoto) + LiDAR, 12MP TrueDepth front',
            battery: '3274 mAh',
            os: 'iOS 17.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 15 Pro Max
    {
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        sku: 'IPHONE-15-PRO-MAX-256GB',
        description:
            'iPhone 15 Pro Max cao cấp nhất với chip A17 Pro, khung Titanium và camera 5x Telephoto.',
        shortDescription: 'iPhone Pro Max cao cấp nhất',
        price: 145000000,
        originalPrice: 180000000,
        discount: 19,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-15-pro-max.jpg']),
        specifications: JSON.stringify({
            display:
                '6.7-inch Super Retina XDR OLED ProMotion 120Hz with Dynamic Island',
            resolution: '1290 x 2796 pixels',
            processor: 'Apple A17 Pro hexa-core (3nm)',
            storage: '256GB/512GB/1TB',
            camera: 'Triple 48MP rear (Wide, Ultra Wide, 5x Telephoto) + LiDAR, 12MP TrueDepth front',
            battery: '4441 mAh',
            os: 'iOS 17.0',
        }),
        isActive: true,
        isFeatured: true,
    },
]

async function seedIPhonesPart4() {
    try {
        console.log(
            '🍎 Bắt đầu seed dữ liệu iPhone Part 4 (13 - 15 Pro Max)...'
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
        for (const iphone of iphoneDataPart4) {
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

        console.log('🎉 Hoàn thành seed dữ liệu iPhone Part 4!')
        console.log(`📱 Đã thêm ${iphoneDataPart4.length} model iPhone`)
    } catch (error) {
        console.error('❌ Lỗi khi seed iPhone Part 4:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Chạy script
seedIPhonesPart4()
