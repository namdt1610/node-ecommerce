import prisma from '../config/database'

async function seedProductVariants() {
    try {
        console.log('Starting product variants seeding...')

        // Get existing products
        const products = await prisma.product.findMany({
            include: { category: true },
        })

        console.log(`Found ${products.length} products to add variants`)

        // Define variant data for different iPhone models
        const variantData: Record<
            string,
            {
                colors: string[]
                storages: string[]
                basePrices: Record<string, number>
            }
        > = {
            // iPhone 15 Series
            'iPhone 15': {
                colors: ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
                storages: ['128GB', '256GB', '512GB'],
                basePrices: {
                    '128GB': 19000000,
                    '256GB': 21000000,
                    '512GB': 25000000,
                },
            },
            'iPhone 15 Plus': {
                colors: ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
                storages: ['128GB', '256GB', '512GB'],
                basePrices: {
                    '128GB': 21000000,
                    '256GB': 23000000,
                    '512GB': 27000000,
                },
            },
            'iPhone 15 Pro': {
                colors: [
                    'Natural Titanium',
                    'Blue Titanium',
                    'White Titanium',
                    'Black Titanium',
                ],
                storages: ['128GB', '256GB', '512GB', '1TB'],
                basePrices: {
                    '128GB': 26000000,
                    '256GB': 28000000,
                    '512GB': 32000000,
                    '1TB': 36000000,
                },
            },
            'iPhone 15 Pro Max': {
                colors: [
                    'Natural Titanium',
                    'Blue Titanium',
                    'White Titanium',
                    'Black Titanium',
                ],
                storages: ['256GB', '512GB', '1TB'],
                basePrices: {
                    '256GB': 30000000,
                    '512GB': 34000000,
                    '1TB': 38000000,
                },
            },
            // iPhone 14 Series
            'iPhone 14': {
                colors: ['Midnight', 'Starlight', 'Blue', 'Purple', 'Red'],
                storages: ['128GB', '256GB', '512GB'],
                basePrices: {
                    '128GB': 12800000,
                    '256GB': 14800000,
                    '512GB': 18800000,
                },
            },
            'iPhone 14 Plus': {
                colors: ['Midnight', 'Starlight', 'Blue', 'Purple', 'Red'],
                storages: ['128GB', '256GB', '512GB'],
                basePrices: {
                    '128GB': 17500000,
                    '256GB': 19500000,
                    '512GB': 23500000,
                },
            },
            'iPhone 14 Pro': {
                colors: ['Deep Purple', 'Gold', 'Silver', 'Space Gray'],
                storages: ['128GB', '256GB', '512GB', '1TB'],
                basePrices: {
                    '128GB': 20000000,
                    '256GB': 22000000,
                    '512GB': 26000000,
                    '1TB': 30000000,
                },
            },
            'iPhone 14 Pro Max': {
                colors: ['Deep Purple', 'Gold', 'Silver', 'Space Gray'],
                storages: ['128GB', '256GB', '512GB', '1TB'],
                basePrices: {
                    '128GB': 23000000,
                    '256GB': 25000000,
                    '512GB': 29000000,
                    '1TB': 33000000,
                },
            },
            // iPhone 13 Series
            'iPhone 13': {
                colors: ['Pink', 'Blue', 'Midnight', 'Starlight', 'Red'],
                storages: ['128GB', '256GB', '512GB'],
                basePrices: {
                    '128GB': 13000000,
                    '256GB': 15000000,
                    '512GB': 19000000,
                },
            },
            'iPhone 13 Mini': {
                colors: ['Pink', 'Blue', 'Midnight', 'Starlight', 'Red'],
                storages: ['128GB', '256GB', '512GB'],
                basePrices: {
                    '128GB': 11500000,
                    '256GB': 13500000,
                    '512GB': 17500000,
                },
            },
            'iPhone 13 Pro': {
                colors: [
                    'Alpine Green',
                    'Silver',
                    'Gold',
                    'Graphite',
                    'Sierra Blue',
                ],
                storages: ['128GB', '256GB', '512GB', '1TB'],
                basePrices: {
                    '128GB': 17000000,
                    '256GB': 19000000,
                    '512GB': 23000000,
                    '1TB': 27000000,
                },
            },
            'iPhone 13 Pro Max': {
                colors: [
                    'Alpine Green',
                    'Silver',
                    'Gold',
                    'Graphite',
                    'Sierra Blue',
                ],
                storages: ['128GB', '256GB', '512GB', '1TB'],
                basePrices: {
                    '128GB': 19000000,
                    '256GB': 21000000,
                    '512GB': 25000000,
                    '1TB': 29000000,
                },
            },
            // iPhone 12 Series
            'iPhone 12': {
                colors: ['Black', 'White', 'Red', 'Green', 'Blue', 'Purple'],
                storages: ['64GB', '128GB', '256GB'],
                basePrices: {
                    '64GB': 10500000,
                    '128GB': 12500000,
                    '256GB': 16500000,
                },
            },
            'iPhone 12 Mini': {
                colors: ['Black', 'White', 'Red', 'Green', 'Blue', 'Purple'],
                storages: ['64GB', '128GB', '256GB'],
                basePrices: {
                    '64GB': 9500000,
                    '128GB': 11500000,
                    '256GB': 15500000,
                },
            },
            'iPhone 12 Pro': {
                colors: ['Silver', 'Graphite', 'Gold', 'Pacific Blue'],
                storages: ['128GB', '256GB', '512GB'],
                basePrices: {
                    '128GB': 14000000,
                    '256GB': 16000000,
                    '512GB': 20000000,
                },
            },
            'iPhone 12 Pro Max': {
                colors: ['Silver', 'Graphite', 'Gold', 'Pacific Blue'],
                storages: ['128GB', '256GB', '512GB'],
                basePrices: {
                    '128GB': 16000000,
                    '256GB': 18000000,
                    '512GB': 22000000,
                },
            },
        }

        for (const product of products) {
            const variantConfig = variantData[product.name]

            if (!variantConfig) {
                console.log(`No variant config found for ${product.name}`)
                continue
            }

            const variants = []

            // Generate all combinations of colors and storages
            for (const color of variantConfig.colors) {
                for (const storage of variantConfig.storages) {
                    const price = variantConfig.basePrices[storage]
                    const originalPrice = Math.floor(price * 1.1) // 10% higher original price

                    variants.push({
                        id: `${product.slug}-${color.toLowerCase().replace(/\s+/g, '-')}-${storage.toLowerCase()}`,
                        name: `${product.name} ${color} ${storage}`,
                        sku: `${product.name.replace(/\s+/g, '').toUpperCase()}-${color.replace(/\s+/g, '').toUpperCase()}-${storage}`,
                        price: price,
                        originalPrice: originalPrice,
                        attributes: [
                            {
                                name: 'Color',
                                value: color,
                            },
                            {
                                name: 'Storage',
                                value: storage,
                            },
                        ],
                        images: [
                            {
                                url: `https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/${product.slug}-${color.toLowerCase().replace(/\s+/g, '-')}-select-2023?wid=940&hei=1112&fmt=png-alpha&.v=1692923777972`,
                                alt: `${product.name} ${color}`,
                                position: 0,
                                isPrimary: true,
                            },
                        ],
                        inventory: {
                            quantity: Math.floor(Math.random() * 50) + 10, // Random quantity between 10-60
                            reservedQuantity: 0,
                            availableQuantity:
                                Math.floor(Math.random() * 50) + 10,
                            lowStockThreshold: 5,
                        },
                        isActive: true,
                    })
                }
            }

            // Update product with variants
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    variants: variants,
                    // Update base price to the lowest variant price
                    price: Math.min(
                        ...(Object.values(variantConfig.basePrices) as number[])
                    ),
                    originalPrice:
                        Math.min(
                            ...(Object.values(
                                variantConfig.basePrices
                            ) as number[])
                        ) * 1.1,
                },
            })

            console.log(
                `✅ Added ${variants.length} variants to ${product.name}`
            )
        }

        console.log('Product variants seeding completed successfully!')
    } catch (error) {
        console.error('Error seeding product variants:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedProductVariants()
