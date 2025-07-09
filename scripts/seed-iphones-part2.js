const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const iphoneDataPart2 = [
    // iPhone 6s
    {
        name: 'iPhone 6s',
        slug: 'iphone-6s',
        brand: 'Apple',
        model: 'iPhone 6s',
        sku: 'IPHONE-6S-64GB',
        description:
            'iPhone 6s với 3D Touch, camera 12MP và Live Photos sống động.',
        shortDescription: 'iPhone với 3D Touch và camera 12MP',
        price: 28000000,
        originalPrice: 35000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-6s.jpg']),
        specifications: JSON.stringify({
            display: '4.7-inch Retina LCD with 3D Touch',
            resolution: '750 x 1334 pixels',
            processor: 'Apple A9 dual-core 1.85 GHz',
            storage: '16GB/64GB/128GB',
            camera: '12MP rear, 5MP front',
            battery: '1715 mAh',
            os: 'iOS 9.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 6s Plus
    {
        name: 'iPhone 6s Plus',
        slug: 'iphone-6s-plus',
        brand: 'Apple',
        model: 'iPhone 6s Plus',
        sku: 'IPHONE-6S-PLUS-64GB',
        description:
            'iPhone 6s Plus với màn hình lớn, 3D Touch và pin mạnh mẽ.',
        shortDescription: 'iPhone Plus với 3D Touch',
        price: 32000000,
        originalPrice: 40000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-6s-plus.jpg']),
        specifications: JSON.stringify({
            display: '5.5-inch Retina LCD with 3D Touch',
            resolution: '1080 x 1920 pixels',
            processor: 'Apple A9 dual-core 1.85 GHz',
            storage: '16GB/64GB/128GB',
            camera: '12MP rear with OIS, 5MP front',
            battery: '2750 mAh',
            os: 'iOS 9.0',
        }),
        isActive: true,
    },

    // iPhone SE (1st gen)
    {
        name: 'iPhone SE (2016)',
        slug: 'iphone-se-2016',
        brand: 'Apple',
        model: 'iPhone SE',
        sku: 'IPHONE-SE-64GB',
        description:
            'iPhone SE với hiệu năng A9 trong thân hình nhỏ gọn của iPhone 5s.',
        shortDescription: 'iPhone nhỏ gọn với hiệu năng mạnh',
        price: 18000000,
        originalPrice: 22000000,
        discount: 18,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-se-2016.jpg']),
        specifications: JSON.stringify({
            display: '4-inch Retina LCD',
            resolution: '640 x 1136 pixels',
            processor: 'Apple A9 dual-core 1.85 GHz',
            storage: '16GB/64GB/128GB',
            camera: '12MP rear, 1.2MP front',
            battery: '1624 mAh',
            os: 'iOS 9.3',
        }),
        isActive: true,
    },

    // iPhone 7
    {
        name: 'iPhone 7',
        slug: 'iphone-7',
        brand: 'Apple',
        model: 'iPhone 7',
        sku: 'IPHONE-7-128GB',
        description:
            'iPhone 7 với thiết kế chống nước, loại bỏ jack tai nghe và camera cải tiến.',
        shortDescription: 'iPhone chống nước đầu tiên',
        price: 35000000,
        originalPrice: 45000000,
        discount: 22,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-7.jpg']),
        specifications: JSON.stringify({
            display: '4.7-inch Retina LCD',
            resolution: '750 x 1334 pixels',
            processor: 'Apple A10 Fusion quad-core',
            storage: '32GB/128GB/256GB',
            camera: '12MP rear with OIS, 7MP front',
            battery: '1960 mAh',
            os: 'iOS 10.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone 7 Plus
    {
        name: 'iPhone 7 Plus',
        slug: 'iphone-7-plus',
        brand: 'Apple',
        model: 'iPhone 7 Plus',
        sku: 'IPHONE-7-PLUS-128GB',
        description:
            'iPhone 7 Plus với camera kép đầu tiên và chế độ Portrait mode.',
        shortDescription: 'iPhone đầu tiên với camera kép',
        price: 40000000,
        originalPrice: 52000000,
        discount: 23,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-7-plus.jpg']),
        specifications: JSON.stringify({
            display: '5.5-inch Retina LCD',
            resolution: '1080 x 1920 pixels',
            processor: 'Apple A10 Fusion quad-core',
            storage: '32GB/128GB/256GB',
            camera: 'Dual 12MP rear, 7MP front',
            battery: '2900 mAh',
            os: 'iOS 10.0',
        }),
        isActive: true,
    },

    // iPhone 8
    {
        name: 'iPhone 8',
        slug: 'iphone-8',
        brand: 'Apple',
        model: 'iPhone 8',
        sku: 'IPHONE-8-64GB',
        description:
            'iPhone 8 với mặt lưng kính, sạc không dây và chip A11 Bionic.',
        shortDescription: 'iPhone với sạc không dây',
        price: 42000000,
        originalPrice: 55000000,
        discount: 24,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-8.jpg']),
        specifications: JSON.stringify({
            display: '4.7-inch Retina LCD',
            resolution: '750 x 1334 pixels',
            processor: 'Apple A11 Bionic hexa-core',
            storage: '64GB/256GB',
            camera: '12MP rear with OIS, 7MP front',
            battery: '1821 mAh',
            os: 'iOS 11.0',
        }),
        isActive: true,
    },

    // iPhone 8 Plus
    {
        name: 'iPhone 8 Plus',
        slug: 'iphone-8-plus',
        brand: 'Apple',
        model: 'iPhone 8 Plus',
        sku: 'IPHONE-8-PLUS-64GB',
        description:
            'iPhone 8 Plus với camera kép Portrait Lighting và sạc không dây.',
        shortDescription: 'iPhone Plus với Portrait Lighting',
        price: 48000000,
        originalPrice: 62000000,
        discount: 23,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-8-plus.jpg']),
        specifications: JSON.stringify({
            display: '5.5-inch Retina LCD',
            resolution: '1080 x 1920 pixels',
            processor: 'Apple A11 Bionic hexa-core',
            storage: '64GB/256GB',
            camera: 'Dual 12MP rear, 7MP front',
            battery: '2691 mAh',
            os: 'iOS 11.0',
        }),
        isActive: true,
    },

    // iPhone X
    {
        name: 'iPhone X',
        slug: 'iphone-x',
        brand: 'Apple',
        model: 'iPhone X',
        sku: 'IPHONE-X-64GB',
        description:
            'iPhone X cách mạng với Face ID, màn hình Super Retina và thiết kế toàn màn hình.',
        shortDescription: 'iPhone cách mạng với Face ID',
        price: 55000000,
        originalPrice: 70000000,
        discount: 21,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-x.jpg']),
        specifications: JSON.stringify({
            display: '5.8-inch Super Retina OLED',
            resolution: '1125 x 2436 pixels',
            processor: 'Apple A11 Bionic hexa-core',
            storage: '64GB/256GB',
            camera: 'Dual 12MP rear with OIS, 7MP TrueDepth front',
            battery: '2716 mAh',
            os: 'iOS 11.0',
        }),
        isActive: true,
        isFeatured: true,
    },

    // iPhone XR
    {
        name: 'iPhone XR',
        slug: 'iphone-xr',
        brand: 'Apple',
        model: 'iPhone XR',
        sku: 'IPHONE-XR-64GB',
        description:
            'iPhone XR với màn hình Liquid Retina, nhiều màu sắc và giá cả hợp lý.',
        shortDescription: 'iPhone đầy màu sắc với Liquid Retina',
        price: 48000000,
        originalPrice: 60000000,
        discount: 20,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-xr.jpg']),
        specifications: JSON.stringify({
            display: '6.1-inch Liquid Retina LCD',
            resolution: '828 x 1792 pixels',
            processor: 'Apple A12 Bionic hexa-core',
            storage: '64GB/128GB/256GB',
            camera: '12MP rear with OIS, 7MP TrueDepth front',
            battery: '2942 mAh',
            os: 'iOS 12.0',
        }),
        isActive: true,
    },

    // iPhone XS
    {
        name: 'iPhone XS',
        slug: 'iphone-xs',
        brand: 'Apple',
        model: 'iPhone XS',
        sku: 'IPHONE-XS-64GB',
        description:
            'iPhone XS với chip A12 Bionic mạnh mẽ và camera Smart HDR.',
        shortDescription: 'iPhone với chip A12 Bionic',
        price: 62000000,
        originalPrice: 78000000,
        discount: 21,
        productType: 'SMARTPHONE',
        condition: 'NEW',
        status: 'ACTIVE',
        images: JSON.stringify(['/images/iphones/iphone-xs.jpg']),
        specifications: JSON.stringify({
            display: '5.8-inch Super Retina OLED',
            resolution: '1125 x 2436 pixels',
            processor: 'Apple A12 Bionic hexa-core',
            storage: '64GB/256GB/512GB',
            camera: 'Dual 12MP rear with OIS, 7MP TrueDepth front',
            battery: '2658 mAh',
            os: 'iOS 12.0',
        }),
        isActive: true,
    },
]

async function seedIPhonesPart2() {
    try {
        console.log('🍎 Bắt đầu seed dữ liệu iPhone Part 2 (6s - XS)...')

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
        for (const iphone of iphoneDataPart2) {
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

        console.log('🎉 Hoàn thành seed dữ liệu iPhone Part 2!')
        console.log(`📱 Đã thêm ${iphoneDataPart2.length} model iPhone`)
    } catch (error) {
        console.error('❌ Lỗi khi seed iPhone Part 2:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Chạy script
seedIPhonesPart2()
