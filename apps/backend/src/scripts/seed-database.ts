import prisma from '../config/database'
import bcrypt from 'bcryptjs'

async function seedDatabase() {
    try {
        console.log('Starting database seeding...')

        // Create roles
        const adminRole = await prisma.role.upsert({
            where: { name: 'admin' },
            update: {},
            create: {
                name: 'admin',
                description: 'Administrator role with full access',
                permissions: {
                    create: [
                        { resource: 'users', action: 'create' },
                        { resource: 'users', action: 'read' },
                        { resource: 'users', action: 'update' },
                        { resource: 'users', action: 'delete' },
                        { resource: 'products', action: 'create' },
                        { resource: 'products', action: 'read' },
                        { resource: 'products', action: 'update' },
                        { resource: 'products', action: 'delete' },
                        { resource: 'orders', action: 'create' },
                        { resource: 'orders', action: 'read' },
                        { resource: 'orders', action: 'update' },
                        { resource: 'orders', action: 'delete' },
                        { resource: 'dashboard', action: 'read' },
                        { resource: 'dashboard', action: 'write' },
                    ],
                },
            },
        })

        const userRole = await prisma.role.upsert({
            where: { name: 'user' },
            update: {},
            create: {
                name: 'user',
                description: 'Regular user role',
                permissions: {
                    create: [
                        { resource: 'products', action: 'read' },
                        { resource: 'orders', action: 'create' },
                        { resource: 'orders', action: 'read' },
                        { resource: 'reviews', action: 'create' },
                        { resource: 'reviews', action: 'read' },
                    ],
                },
            },
        })

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 12)
        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@bookscape.com' },
            update: {},
            create: {
                name: 'Admin User',
                email: 'admin@bookscape.com',
                password: hashedPassword,
                roleId: adminRole.id,
                status: 'ACTIVE',
            },
        })

        // Create categories
        const categories = [
            {
                name: 'iPhone 6 Series',
                slug: 'iphone-6-series',
                description: 'iPhone 6, 6 Plus, 6s, 6s Plus',
            },
            {
                name: 'iPhone 7 Series',
                slug: 'iphone-7-series',
                description: 'iPhone 7, 7 Plus',
            },
            {
                name: 'iPhone 8 Series',
                slug: 'iphone-8-series',
                description: 'iPhone 8, 8 Plus',
            },
            {
                name: 'iPhone X Series',
                slug: 'iphone-x-series',
                description: 'iPhone X, XR, XS, XS Max',
            },
            {
                name: 'iPhone 11 Series',
                slug: 'iphone-11-series',
                description: 'iPhone 11, 11 Pro, 11 Pro Max',
            },
            {
                name: 'iPhone 12 Series',
                slug: 'iphone-12-series',
                description: 'iPhone 12, 12 Mini, 12 Pro, 12 Pro Max',
            },
            {
                name: 'iPhone 13 Series',
                slug: 'iphone-13-series',
                description: 'iPhone 13, 13 Mini, 13 Pro, 13 Pro Max',
            },
            {
                name: 'iPhone SE Series',
                slug: 'iphone-se-series',
                description: 'iPhone SE 2020, SE 2022',
            },
            {
                name: 'iPhone 14 Series',
                slug: 'iphone-14-series',
                description: 'iPhone 14, 14 Plus, 14 Pro, 14 Pro Max',
            },
            {
                name: 'iPhone 15 Series',
                slug: 'iphone-15-series',
                description: 'iPhone 15, 15 Plus, 15 Pro, 15 Pro Max',
            },
        ]

        const createdCategories = []
        for (const category of categories) {
            const createdCategory = await prisma.category.upsert({
                where: { name: category.name },
                update: {},
                create: category,
            })
            createdCategories.push(createdCategory)
        }

        // Delete all related data before deleting products
        await prisma.inventoryActivity.deleteMany({})
        await prisma.inventory.deleteMany({})
        await prisma.cartItem.deleteMany({})
        await prisma.orderItem.deleteMany({})
        await prisma.review.deleteMany({})
        // Delete all old products
        await prisma.product.deleteMany({})

        // Create iPhone products
        const iphoneProducts = [
            // iPhone 6 Series
            {
                name: 'iPhone 6',
                description: 'Apple iPhone 6, 4.7-inch display, A8 chip',
                price: 1200000,
                categoryName: 'iPhone 6 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone6-select-2014?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone 6 Plus',
                description: 'Apple iPhone 6 Plus, 5.5-inch display, A8 chip',
                price: 1500000,
                categoryName: 'iPhone 6 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone6-plus-select-2014?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone 6s',
                description: 'Apple iPhone 6s, 4.7-inch display, A9 chip',
                price: 1800000,
                categoryName: 'iPhone 6 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone6s-select-2015?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone 6s Plus',
                description: 'Apple iPhone 6s Plus, 5.5-inch display, A9 chip',
                price: 2200000,
                categoryName: 'iPhone 6 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone6s-plus-select-2015?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            // iPhone 7 Series
            {
                name: 'iPhone 7',
                description:
                    'Apple iPhone 7, 4.7-inch display, A10 Fusion chip',
                price: 2500000,
                categoryName: 'iPhone 7 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone7-select-2016?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone 7 Plus',
                description:
                    'Apple iPhone 7 Plus, 5.5-inch display, A10 Fusion chip',
                price: 3500000,
                categoryName: 'iPhone 7 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone7-plus-select-2016?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            // iPhone 8 Series
            {
                name: 'iPhone 8',
                description:
                    'Apple iPhone 8, 4.7-inch display, A11 Bionic chip',
                price: 3800000,
                categoryName: 'iPhone 8 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone8-select-2017?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone 8 Plus',
                description:
                    'Apple iPhone 8 Plus, 5.5-inch display, A11 Bionic chip',
                price: 4800000,
                categoryName: 'iPhone 8 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone8-plus-select-2017?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            // iPhone X Series
            {
                name: 'iPhone X',
                description:
                    'Apple iPhone X, 5.8-inch Super Retina display, Face ID',
                price: 5500000,
                categoryName: 'iPhone X Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-x-select-2017?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone XR',
                description:
                    'Apple iPhone XR, 6.1-inch Liquid Retina display, Face ID',
                price: 6000000,
                categoryName: 'iPhone X Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-xr-select-2018?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone XS',
                description:
                    'Apple iPhone XS, 5.8-inch Super Retina display, Face ID',
                price: 6500000,
                categoryName: 'iPhone X Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-xs-select-2018?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone XS Max',
                description:
                    'Apple iPhone XS Max, 6.5-inch Super Retina display, Face ID',
                price: 7500000,
                categoryName: 'iPhone X Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-xs-max-select-2018?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            // iPhone 11 Series
            {
                name: 'iPhone 11',
                description:
                    'Apple iPhone 11, 6.1-inch Liquid Retina display, A13 Bionic chip',
                price: 8500000,
                categoryName: 'iPhone 11 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-select-2019?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone 11 Pro',
                description:
                    'Apple iPhone 11 Pro, 5.8-inch Super Retina XDR display, triple camera',
                price: 10500000,
                categoryName: 'iPhone 11 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-pro-select-2019?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            {
                name: 'iPhone 11 Pro Max',
                description:
                    'Apple iPhone 11 Pro Max, 6.5-inch Super Retina XDR display, triple camera',
                price: 12000000,
                categoryName: 'iPhone 11 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-pro-max-select-2019?wid=940&hei=1112&fmt=png-alpha&.v=1550795426402',
            },
            // iPhone SE Series
            {
                name: 'iPhone SE (2020)',
                description:
                    'Apple iPhone SE 2020, 4.7-inch display, A13 Bionic chip',
                price: 4500000,
                categoryName: 'iPhone SE Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-se-2020-select?wid=940&hei=1112&fmt=png-alpha&.v=1586574260319',
            },
            {
                name: 'iPhone SE (2022)',
                description:
                    'Apple iPhone SE 2022, 4.7-inch display, A15 Bionic chip',
                price: 7000000,
                categoryName: 'iPhone SE Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-se-2022-select?wid=940&hei=1112&fmt=png-alpha&.v=1646415838921',
            },
            // iPhone 12 Series
            {
                name: 'iPhone 12',
                description:
                    'Apple iPhone 12, 6.1-inch Super Retina XDR display, 5G',
                price: 10500000,
                categoryName: 'iPhone 12 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-select-2020?wid=940&hei=1112&fmt=png-alpha&.v=1604343709000',
            },
            {
                name: 'iPhone 12 Mini',
                description:
                    'Apple iPhone 12 Mini, 5.4-inch Super Retina XDR display, 5G',
                price: 9500000,
                categoryName: 'iPhone 12 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-mini-select-2020?wid=940&hei=1112&fmt=png-alpha&.v=1604343709000',
            },
            {
                name: 'iPhone 12 Pro',
                description:
                    'Apple iPhone 12 Pro, 6.1-inch Super Retina XDR display, triple camera',
                price: 14000000,
                categoryName: 'iPhone 12 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-pro-select-2020?wid=940&hei=1112&fmt=png-alpha&.v=1604343709000',
            },
            {
                name: 'iPhone 12 Pro Max',
                description:
                    'Apple iPhone 12 Pro Max, 6.7-inch Super Retina XDR display, triple camera',
                price: 16000000,
                categoryName: 'iPhone 12 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-pro-max-select-2020?wid=940&hei=1112&fmt=png-alpha&.v=1604343709000',
            },
            // iPhone 13 Series
            {
                name: 'iPhone 13',
                description:
                    'Apple iPhone 13, 6.1-inch Super Retina XDR display, A15 Bionic chip',
                price: 13000000,
                categoryName: 'iPhone 13 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-select-2021?wid=940&hei=1112&fmt=png-alpha&.v=1645572315935',
            },
            {
                name: 'iPhone 13 Mini',
                description:
                    'Apple iPhone 13 Mini, 5.4-inch Super Retina XDR display, A15 Bionic chip',
                price: 11500000,
                categoryName: 'iPhone 13 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-mini-select-2021?wid=940&hei=1112&fmt=png-alpha&.v=1645572315935',
            },
            {
                name: 'iPhone 13 Pro',
                description:
                    'Apple iPhone 13 Pro, 6.1-inch Super Retina XDR display, triple camera',
                price: 17000000,
                categoryName: 'iPhone 13 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-select-2021?wid=940&hei=1112&fmt=png-alpha&.v=1645572315935',
            },
            {
                name: 'iPhone 13 Pro Max',
                description:
                    'Apple iPhone 13 Pro Max, 6.7-inch Super Retina XDR display, triple camera',
                price: 19000000,
                categoryName: 'iPhone 13 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-max-select-2021?wid=940&hei=1112&fmt=png-alpha&.v=1645572315935',
            },
            // iPhone 14 Series
            {
                name: 'iPhone 14',
                description:
                    'Apple iPhone 14, 6.1-inch Super Retina XDR display, A15 Bionic chip',
                price: 12800000,
                categoryName: 'iPhone 14 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-select-2022?wid=940&hei=1112&fmt=png-alpha&.v=1661027788817',
            },
            {
                name: 'iPhone 14 Plus',
                description:
                    'Apple iPhone 14 Plus, 6.7-inch Super Retina XDR display, A15 Bionic chip',
                price: 17500000,
                categoryName: 'iPhone 14 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-plus-select-2022?wid=940&hei=1112&fmt=png-alpha&.v=1661027788817',
            },
            {
                name: 'iPhone 14 Pro',
                description:
                    'Apple iPhone 14 Pro, 6.1-inch Super Retina XDR display, Dynamic Island',
                price: 20000000,
                categoryName: 'iPhone 14 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-select-2022?wid=940&hei=1112&fmt=png-alpha&.v=1661027788817',
            },
            {
                name: 'iPhone 14 Pro Max',
                description:
                    'Apple iPhone 14 Pro Max, 6.7-inch Super Retina XDR display, Dynamic Island',
                price: 23000000,
                categoryName: 'iPhone 14 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-max-select-2022?wid=940&hei=1112&fmt=png-alpha&.v=1661027788817',
            },
            // iPhone 15 Series
            {
                name: 'iPhone 15',
                description:
                    'Apple iPhone 15, 6.1-inch Super Retina XDR display, USB-C',
                price: 19000000,
                categoryName: 'iPhone 15 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-select-2023?wid=940&hei=1112&fmt=png-alpha&.v=1692923777972',
            },
            {
                name: 'iPhone 15 Plus',
                description:
                    'Apple iPhone 15 Plus, 6.7-inch Super Retina XDR display, USB-C',
                price: 21000000,
                categoryName: 'iPhone 15 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-plus-select-2023?wid=940&hei=1112&fmt=png-alpha&.v=1692923777972',
            },
            {
                name: 'iPhone 15 Pro',
                description:
                    'Apple iPhone 15 Pro, 6.1-inch Super Retina XDR display, Titanium',
                price: 26000000,
                categoryName: 'iPhone 15 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-select-2023?wid=940&hei=1112&fmt=png-alpha&.v=1692923777972',
            },
            {
                name: 'iPhone 15 Pro Max',
                description:
                    'Apple iPhone 15 Pro Max, 6.7-inch Super Retina XDR display, Titanium',
                price: 30000000,
                categoryName: 'iPhone 15 Series',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-select-2023?wid=940&hei=1112&fmt=png-alpha&.v=1692923777972',
            },
        ]

        for (const product of iphoneProducts) {
            const category = createdCategories.find(
                (c) => c.name === product.categoryName
            )
            if (category) {
                await prisma.product.create({
                    data: {
                        name: product.name,
                        slug: product.name
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w-]/g, ''),
                        brand: 'Apple',
                        model: product.name,
                        sku: `${product.name.replace(/\s+/g, '').toUpperCase()}-001`,
                        description: product.description,
                        price: product.price,
                        originalPrice: product.price,
                        currency: 'VND',
                        categoryId: category.id,
                        productType: 'SMARTPHONE',
                        condition: 'NEW',
                        status: 'ACTIVE',
                        images: [
                            {
                                url: product.image,
                                alt: product.name,
                                position: 0,
                                isPrimary: true,
                            },
                        ],
                        inventory: {
                            totalQuantity: 100,
                            availableQuantity: 100,
                            reservedQuantity: 0,
                            lowStockThreshold: 10,
                            trackQuantity: true,
                            allowBackorder: false,
                        },
                        ratings: {
                            averageRating: 4.5,
                            totalReviews: 10,
                            ratingDistribution: {
                                1: 0,
                                2: 0,
                                3: 1,
                                4: 4,
                                5: 5,
                            },
                        },
                        seo: {
                            metaTitle: product.name,
                            metaDescription: product.description,
                        },
                        isActive: true,
                        isFeatured: false,
                        isDigital: false,
                    },
                })
            }
        }

        // Create a warehouse
        const warehouse = await prisma.warehouse.upsert({
            where: { name: 'Main Warehouse' },
            update: {},
            create: {
                name: 'Main Warehouse',
                address: '123 Main Street, City, State 12345',
                description: 'Primary warehouse for book storage',
            },
        })

        console.log('Database seeding completed successfully!')
        console.log('Created:')
        console.log('- Admin user: admin@bookscape.com / admin123')
        console.log('- 2 roles: admin, user')
        console.log('- 5 categories')
        console.log('- 5 sample products')
        console.log('- 1 warehouse')
    } catch (error) {
        console.error('Error seeding database:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedDatabase()
