const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Định nghĩa màu sắc cho từng dòng iPhone
const iphoneColors = {
    // iPhone cũ - màu ít
    'iphone-original': ['Black'],
    'iphone-3g': ['Black', 'White'],
    'iphone-3gs': ['Black', 'White'],
    'iphone-4': ['Black', 'White'],
    'iphone-4s': ['Black', 'White'],

    // iPhone 5 series
    'iphone-5': ['Black', 'White'],
    'iphone-5c': ['White', 'Pink', 'Yellow', 'Blue', 'Green'],
    'iphone-5s': ['Space Gray', 'Silver', 'Gold'],

    // iPhone 6 series
    'iphone-6': ['Space Gray', 'Silver', 'Gold'],
    'iphone-6-plus': ['Space Gray', 'Silver', 'Gold'],
    'iphone-6s': ['Space Gray', 'Silver', 'Gold', 'Rose Gold'],
    'iphone-6s-plus': ['Space Gray', 'Silver', 'Gold', 'Rose Gold'],

    // iPhone SE & 7 series
    'iphone-se-2016': ['Space Gray', 'Silver', 'Gold', 'Rose Gold'],
    'iphone-7': ['Black', 'Jet Black', 'Silver', 'Gold', 'Rose Gold'],
    'iphone-7-plus': ['Black', 'Jet Black', 'Silver', 'Gold', 'Rose Gold'],

    // iPhone 8 & X series
    'iphone-8': ['Space Gray', 'Silver', 'Gold'],
    'iphone-8-plus': ['Space Gray', 'Silver', 'Gold'],
    'iphone-x': ['Space Gray', 'Silver'],

    // iPhone XR, XS series
    'iphone-xr': ['Black', 'White', 'Red', 'Yellow', 'Blue', 'Coral'],
    'iphone-xs': ['Space Gray', 'Silver', 'Gold'],
    'iphone-xs-max': ['Space Gray', 'Silver', 'Gold'],

    // iPhone 11 series
    'iphone-11': ['Black', 'White', 'Red', 'Yellow', 'Green', 'Purple'],
    'iphone-11-pro': ['Space Gray', 'Silver', 'Gold', 'Midnight Green'],
    'iphone-11-pro-max': ['Space Gray', 'Silver', 'Gold', 'Midnight Green'],

    // iPhone SE 2020 & 12 series
    'iphone-se-2020': ['Black', 'White', 'Red'],
    'iphone-12-mini': ['Black', 'White', 'Red', 'Green', 'Blue', 'Purple'],
    'iphone-12': ['Black', 'White', 'Red', 'Green', 'Blue', 'Purple'],
    'iphone-12-pro': ['Graphite', 'Silver', 'Gold', 'Pacific Blue'],
    'iphone-12-pro-max': ['Graphite', 'Silver', 'Gold', 'Pacific Blue'],

    // iPhone 13 series
    'iphone-13-mini': ['Pink', 'Blue', 'Midnight', 'Starlight', 'Red'],
    'iphone-13': ['Pink', 'Blue', 'Midnight', 'Starlight', 'Red'],
    'iphone-13-pro': [
        'Graphite',
        'Gold',
        'Silver',
        'Sierra Blue',
        'Alpine Green',
    ],
    'iphone-13-pro-max': [
        'Graphite',
        'Gold',
        'Silver',
        'Sierra Blue',
        'Alpine Green',
    ],

    // iPhone SE 2022 & 14 series
    'iphone-se-2022': ['Midnight', 'Starlight', 'Red'],
    'iphone-14': ['Blue', 'Purple', 'Midnight', 'Starlight', 'Red'],
    'iphone-14-plus': ['Blue', 'Purple', 'Midnight', 'Starlight', 'Red'],
    'iphone-14-pro': ['Deep Purple', 'Gold', 'Silver', 'Space Black'],
    'iphone-14-pro-max': ['Deep Purple', 'Gold', 'Silver', 'Space Black'],

    // iPhone 15 series
    'iphone-15': ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
    'iphone-15-plus': ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
    'iphone-15-pro': [
        'Natural Titanium',
        'Blue Titanium',
        'White Titanium',
        'Black Titanium',
    ],
    'iphone-15-pro-max': [
        'Natural Titanium',
        'Blue Titanium',
        'White Titanium',
        'Black Titanium',
    ],
}

// Định nghĩa storage options cho từng dòng iPhone
const iphoneStorage = {
    // iPhone cũ
    'iphone-original': ['4GB', '8GB', '16GB'],
    'iphone-3g': ['8GB', '16GB'],
    'iphone-3gs': ['8GB', '16GB', '32GB'],
    'iphone-4': ['8GB', '16GB', '32GB'],
    'iphone-4s': ['8GB', '16GB', '32GB', '64GB'],

    // iPhone 5 series
    'iphone-5': ['16GB', '32GB', '64GB'],
    'iphone-5c': ['8GB', '16GB', '32GB'],
    'iphone-5s': ['16GB', '32GB', '64GB'],

    // iPhone 6 series
    'iphone-6': ['16GB', '64GB', '128GB'],
    'iphone-6-plus': ['16GB', '64GB', '128GB'],
    'iphone-6s': ['16GB', '64GB', '128GB'],
    'iphone-6s-plus': ['16GB', '64GB', '128GB'],

    // iPhone SE & 7 series
    'iphone-se-2016': ['16GB', '64GB', '128GB'],
    'iphone-7': ['32GB', '128GB', '256GB'],
    'iphone-7-plus': ['32GB', '128GB', '256GB'],

    // iPhone 8 & X series
    'iphone-8': ['64GB', '256GB'],
    'iphone-8-plus': ['64GB', '256GB'],
    'iphone-x': ['64GB', '256GB'],

    // iPhone XR, XS series
    'iphone-xr': ['64GB', '128GB', '256GB'],
    'iphone-xs': ['64GB', '256GB', '512GB'],
    'iphone-xs-max': ['64GB', '256GB', '512GB'],

    // iPhone 11 series
    'iphone-11': ['64GB', '128GB', '256GB'],
    'iphone-11-pro': ['64GB', '256GB', '512GB'],
    'iphone-11-pro-max': ['64GB', '256GB', '512GB'],

    // iPhone SE 2020 & 12 series
    'iphone-se-2020': ['64GB', '128GB', '256GB'],
    'iphone-12-mini': ['64GB', '128GB', '256GB'],
    'iphone-12': ['64GB', '128GB', '256GB'],
    'iphone-12-pro': ['128GB', '256GB', '512GB'],
    'iphone-12-pro-max': ['128GB', '256GB', '512GB'],

    // iPhone 13 series
    'iphone-13-mini': ['128GB', '256GB', '512GB'],
    'iphone-13': ['128GB', '256GB', '512GB'],
    'iphone-13-pro': ['128GB', '256GB', '512GB', '1TB'],
    'iphone-13-pro-max': ['128GB', '256GB', '512GB', '1TB'],

    // iPhone SE 2022 & 14 series
    'iphone-se-2022': ['64GB', '128GB', '256GB'],
    'iphone-14': ['128GB', '256GB', '512GB'],
    'iphone-14-plus': ['128GB', '256GB', '512GB'],
    'iphone-14-pro': ['128GB', '256GB', '512GB', '1TB'],
    'iphone-14-pro-max': ['128GB', '256GB', '512GB', '1TB'],

    // iPhone 15 series
    'iphone-15': ['128GB', '256GB', '512GB'],
    'iphone-15-plus': ['128GB', '256GB', '512GB'],
    'iphone-15-pro': ['128GB', '256GB', '512GB', '1TB'],
    'iphone-15-pro-max': ['256GB', '512GB', '1TB'],
}

// Tính giá dựa theo storage (giá tăng theo dung lượng)
function calculateStoragePrice(basePrice, storage) {
    const storageMultiplier = {
        '4GB': 0.7,
        '8GB': 0.8,
        '16GB': 0.9,
        '32GB': 1.0,
        '64GB': 1.0,
        '128GB': 1.1,
        '256GB': 1.2,
        '512GB': 1.4,
        '1TB': 1.6,
    }
    return Math.round(basePrice * (storageMultiplier[storage] || 1.0))
}

function generateVariantSKU(baseSKU, color, storage) {
    const colorCode = color.replace(/\s+/g, '').toUpperCase().substring(0, 3)
    return `${baseSKU}-${colorCode}-${storage}`
}

async function seedIPhoneVariants() {
    try {
        console.log('🎨 Bắt đầu seed variants cho tất cả iPhone...')

        // Lấy tất cả iPhone products
        const iphones = await prisma.product.findMany({
            where: {
                category: {
                    name: 'iPhone',
                },
            },
        })

        console.log(`📱 Tìm thấy ${iphones.length} iPhone để thêm variants`)

        for (const iphone of iphones) {
            const colors = iphoneColors[iphone.slug] || ['Space Gray', 'Silver']
            const storages = iphoneStorage[iphone.slug] || ['64GB', '128GB']

            console.log(`\n🔧 Đang xử lý ${iphone.name}...`)
            console.log(`   Màu sắc: ${colors.join(', ')}`)
            console.log(`   Dung lượng: ${storages.join(', ')}`)

            const variants = []

            // Tạo variants cho mỗi combination của color x storage
            for (const color of colors) {
                for (const storage of storages) {
                    const variantPrice = calculateStoragePrice(
                        iphone.price,
                        storage
                    )
                    const variantOriginalPrice = calculateStoragePrice(
                        iphone.originalPrice || iphone.price,
                        storage
                    )

                    const variant = {
                        id: `${iphone.id}-${color.replace(/\s+/g, '')}-${storage}`,
                        name: `${iphone.name} ${storage} ${color}`,
                        sku: generateVariantSKU(iphone.sku, color, storage),
                        price:
                            variantPrice !== iphone.price
                                ? variantPrice
                                : undefined,
                        originalPrice:
                            variantOriginalPrice !==
                            (iphone.originalPrice || iphone.price)
                                ? variantOriginalPrice
                                : undefined,
                        attributes: [
                            { name: 'Color', value: color },
                            { name: 'Storage', value: storage },
                        ],
                        images: [
                            `/images/iphones/${iphone.slug}-${color.toLowerCase().replace(/\s+/g, '-')}.jpg`,
                        ],
                        inventory: {
                            quantity: Math.floor(Math.random() * 50) + 10, // Random stock 10-60
                            reservedQuantity: 0,
                            availableQuantity:
                                Math.floor(Math.random() * 50) + 10,
                            lowStockThreshold: 5,
                        },
                        isActive: true,
                    }

                    variants.push(variant)
                }
            }

            // Update product với variants
            await prisma.product.update({
                where: { id: iphone.id },
                data: {
                    variants: JSON.stringify(variants),
                },
            })

            console.log(`   ✅ Đã thêm ${variants.length} variants`)
        }

        console.log('\n🎉 Hoàn thành seed variants cho tất cả iPhone!')

        // Thống kê
        const totalVariants = Object.values(iphoneColors).reduce(
            (total, colors) => {
                const phoneSlug =
                    Object.keys(iphoneColors)[
                        Object.values(iphoneColors).indexOf(colors)
                    ]
                const storageCount = iphoneStorage[phoneSlug]?.length || 2
                return total + colors.length * storageCount
            },
            0
        )

        console.log(`\n📊 THỐNG KÊ:`)
        console.log(`• Tổng số variants: ~${totalVariants}`)
        console.log(`• Màu sắc đa dạng: 2-6 màu/model`)
        console.log(`• Dung lượng: 2-4 options/model`)
        console.log(`• Giá tự động điều chỉnh theo storage`)
        console.log(`• Inventory ngẫu nhiên cho mỗi variant`)
    } catch (error) {
        console.error('❌ Lỗi khi seed variants:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Chạy script
seedIPhoneVariants()
