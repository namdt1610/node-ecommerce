const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')

// Initialize Prisma with custom database URL for Docker
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://namdt:namdt2003@localhost:5433/apple?schema=public',
        },
    },
})

// Seed configuration
const CONFIG = {
    roles: 3,
    users: 50,
    categories: 15,
    products: 200,
    warehouses: 5,
    orders: 100,
    reviews: 150,
    cartItems: 80,
}

// Helper functions
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)]
const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min

// Product types and their categories
const PRODUCT_CATEGORIES = {
    SMARTPHONE: ['Smartphones', 'Mobile Phones', 'Android Phones', 'iPhones'],
    LAPTOP: ['Laptops', 'Gaming Laptops', 'Business Laptops', 'Ultrabooks'],
    TABLET: ['Tablets', 'iPad', 'Android Tablets', 'Windows Tablets'],
    ACCESSORIES: ['Phone Cases', 'Chargers', 'Cables', 'Screen Protectors'],
    AUDIO: ['Headphones', 'Speakers', 'Earbuds', 'Microphones'],
    WEARABLE: ['Smartwatches', 'Fitness Trackers', 'Smart Bands'],
    GAMING: ['Gaming Consoles', 'Controllers', 'Gaming Accessories'],
    SOFTWARE: ['Mobile Apps', 'Desktop Software', 'Productivity Tools'],
    SERVICES: ['Warranties', 'Support Plans', 'Cloud Storage'],
}

const SMARTPHONE_BRANDS = [
    'Apple',
    'Samsung',
    'Google',
    'OnePlus',
    'Xiaomi',
    'Huawei',
    'Oppo',
    'Vivo',
]
const LAPTOP_BRANDS = [
    'Apple',
    'Dell',
    'HP',
    'Lenovo',
    'Asus',
    'Acer',
    'MSI',
    'Microsoft',
]
const AUDIO_BRANDS = [
    'Apple',
    'Sony',
    'Bose',
    'JBL',
    'Sennheiser',
    'Audio-Technica',
    'Beats',
]

// Seed functions
async function seedRoles() {
    console.log('🎭 Seeding roles...')

    const roles = [
        {
            name: 'admin',
            description: 'Full system access',
            permissions: [
                { resource: 'users', action: 'read' },
                { resource: 'users', action: 'write' },
                { resource: 'products', action: 'read' },
                { resource: 'products', action: 'write' },
                { resource: 'orders', action: 'read' },
                { resource: 'orders', action: 'write' },
                { resource: 'dashboard', action: 'read' },
                { resource: 'dashboard', action: 'write' },
            ],
        },
        {
            name: 'user',
            description: 'Regular user access',
            permissions: [
                { resource: 'products', action: 'read' },
                { resource: 'orders', action: 'read' },
                { resource: 'cart', action: 'write' },
            ],
        },
        {
            name: 'moderator',
            description: 'Content moderation access',
            permissions: [
                { resource: 'products', action: 'read' },
                { resource: 'reviews', action: 'write' },
                { resource: 'users', action: 'read' },
            ],
        },
    ]

    for (const roleData of roles) {
        const role = await prisma.role.create({
            data: {
                name: roleData.name,
                description: roleData.description,
            },
        })

        for (const permData of roleData.permissions) {
            await prisma.permission.create({
                data: {
                    resource: permData.resource,
                    action: permData.action,
                    roleId: role.id,
                },
            })
        }
    }

    console.log(`✅ Created ${roles.length} roles with permissions`)
}

async function seedCategories() {
    console.log('📁 Seeding categories...')

    const categories = []

    for (const [productType, categoryNames] of Object.entries(
        PRODUCT_CATEGORIES
    )) {
        for (const categoryName of categoryNames) {
            categories.push({
                name: categoryName,
                description: faker.commerce.productDescription(),
                imageUrl: faker.image.url({ width: 400, height: 300 }),
            })
        }
    }

    // Shuffle and take only CONFIG.categories number
    const shuffledCategories = categories
        .sort(() => 0.5 - Math.random())
        .slice(0, CONFIG.categories)

    await prisma.category.createMany({
        data: shuffledCategories,
    })

    console.log(`✅ Created ${shuffledCategories.length} categories`)
}

async function seedUsers() {
    console.log('👥 Seeding users...')

    const roles = await prisma.role.findMany()
    const userRole = roles.find((r) => r.name === 'user')
    const adminRole = roles.find((r) => r.name === 'admin')

    const users = []

    // Create admin user
    users.push({
        name: 'Admin User',
        email: 'admin@bookscape.com',
        username: 'admin',
        password:
            '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        roleId: adminRole.id,
        status: 'ACTIVE',
        avatar: faker.image.avatar(),
        favorites: [],
    })

    // Create regular users
    for (let i = 0; i < CONFIG.users - 1; i++) {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()

        users.push({
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            username: faker.internet
                .username({ firstName, lastName })
                .toLowerCase(),
            password:
                '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            roleId: userRole.id,
            status: randomChoice(['ACTIVE', 'INACTIVE']),
            avatar: faker.image.avatar(),
            favorites: [],
        })
    }

    await prisma.user.createMany({
        data: users,
    })

    console.log(`✅ Created ${users.length} users`)
}

async function seedWarehouses() {
    console.log('🏭 Seeding warehouses...')

    const warehouses = []

    for (let i = 0; i < CONFIG.warehouses; i++) {
        warehouses.push({
            name: `${faker.location.city()} Warehouse`,
            address: faker.location.streetAddress({ useFullAddress: true }),
            description: faker.company.catchPhrase(),
        })
    }

    await prisma.warehouse.createMany({
        data: warehouses,
    })

    console.log(`✅ Created ${warehouses.length} warehouses`)
}

async function seedProducts() {
    console.log('📱 Seeding products...')

    const categories = await prisma.category.findMany()
    const products = []

    for (let i = 0; i < CONFIG.products; i++) {
        const category = randomChoice(categories)
        const productType = getProductTypeFromCategory(category.name)
        const brand = getBrandForProductType(productType)

        const basePrice = randomInt(50, 2000)
        const discount = randomInt(0, 30)
        const discountedPrice = basePrice * (1 - discount / 100)

        const product = {
            name: generateProductName(productType, brand),
            description: faker.commerce.productDescription(),
            price: Math.round(discountedPrice),
            imageUrl: faker.image.url({ width: 500, height: 500 }),
            categoryId: category.id,
        }

        products.push(product)
    }

    await prisma.product.createMany({
        data: products,
    })

    console.log(`✅ Created ${products.length} products`)
}

async function seedInventory() {
    console.log('📦 Seeding inventory...')

    const products = await prisma.product.findMany()
    const warehouses = await prisma.warehouse.findMany()

    const inventories = []

    for (const product of products) {
        // Each product will be in 1-3 random warehouses
        const numWarehouses = randomInt(1, Math.min(3, warehouses.length))
        const selectedWarehouses = warehouses
            .sort(() => 0.5 - Math.random())
            .slice(0, numWarehouses)

        for (const warehouse of selectedWarehouses) {
            const quantity = randomInt(0, 100)

            inventories.push({
                productId: product.id,
                warehouseId: warehouse.id,
                quantity,
                minStock: randomInt(5, 20),
                maxStock: randomInt(50, 200),
            })
        }
    }

    await prisma.inventory.createMany({
        data: inventories,
    })

    // Add some inventory activities
    const createdInventories = await prisma.inventory.findMany()
    const activities = []

    for (let i = 0; i < 50; i++) {
        const inventory = randomChoice(createdInventories)

        activities.push({
            inventoryId: inventory.id,
            type: randomChoice(['INBOUND', 'OUTBOUND', 'ADJUSTMENT']),
            quantity: randomInt(-20, 50),
            reason: faker.lorem.sentence(),
        })
    }

    await prisma.inventoryActivity.createMany({
        data: activities,
    })

    console.log(
        `✅ Created ${inventories.length} inventory records and ${activities.length} activities`
    )
}

async function seedOrders() {
    console.log('🛍️ Seeding orders...')

    const users = await prisma.user.findMany({
        where: { role: { name: 'user' } },
    })
    const products = await prisma.product.findMany()

    const orders = []
    const orderItems = []

    for (let i = 0; i < CONFIG.orders; i++) {
        const user = randomChoice(users)
        const numItems = randomInt(1, 5)
        const selectedProducts = products
            .sort(() => 0.5 - Math.random())
            .slice(0, numItems)

        let total = 0
        const orderItemsForThisOrder = []

        for (const product of selectedProducts) {
            const quantity = randomInt(1, 3)
            const price = product.price
            const itemTotal = price * quantity
            total += itemTotal

            orderItemsForThisOrder.push({
                productId: product.id,
                quantity,
                price,
            })
        }

        const order = {
            userId: user.id,
            status: randomChoice([
                'PENDING',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED',
            ]),
            total,
        }

        orders.push({ order, items: orderItemsForThisOrder })
    }

    // Create orders and their items
    for (const { order, items } of orders) {
        const createdOrder = await prisma.order.create({
            data: order,
        })

        const orderItemsWithOrderId = items.map((item) => ({
            ...item,
            orderId: createdOrder.id,
        }))

        await prisma.orderItem.createMany({
            data: orderItemsWithOrderId,
        })
    }

    console.log(`✅ Created ${orders.length} orders with items`)
}

async function seedCartItems() {
    console.log('🛒 Seeding cart items...')

    const users = await prisma.user.findMany({
        where: { role: { name: 'user' } },
    })
    const products = await prisma.product.findMany()

    const cartItems = []

    for (let i = 0; i < CONFIG.cartItems; i++) {
        const user = randomChoice(users)
        const product = randomChoice(products)

        // Check if this user-product combination already exists
        const existingCombination = cartItems.find(
            (item) => item.userId === user.id && item.productId === product.id
        )

        if (!existingCombination) {
            cartItems.push({
                userId: user.id,
                productId: product.id,
                quantity: randomInt(1, 5),
            })
        }
    }

    await prisma.cartItem.createMany({
        data: cartItems,
        skipDuplicates: true,
    })

    console.log(`✅ Created ${cartItems.length} cart items`)
}

async function seedReviews() {
    console.log('⭐ Seeding reviews...')

    const users = await prisma.user.findMany({
        where: { role: { name: 'user' } },
    })
    const products = await prisma.product.findMany()

    const reviews = []

    for (let i = 0; i < CONFIG.reviews; i++) {
        const user = randomChoice(users)
        const product = randomChoice(products)

        // Check if this user-product combination already exists
        const existingCombination = reviews.find(
            (review) =>
                review.userId === user.id && review.productId === product.id
        )

        if (!existingCombination) {
            reviews.push({
                userId: user.id,
                productId: product.id,
                rating: randomInt(1, 5),
                comment: Math.random() > 0.3 ? faker.lorem.paragraph() : null,
            })
        }
    }

    await prisma.review.createMany({
        data: reviews,
        skipDuplicates: true,
    })

    console.log(`✅ Created ${reviews.length} reviews`)
}

// Helper functions for product generation
function getProductTypeFromCategory(categoryName) {
    for (const [type, categories] of Object.entries(PRODUCT_CATEGORIES)) {
        if (categories.includes(categoryName)) {
            return type
        }
    }
    return 'ACCESSORIES'
}

function getBrandForProductType(productType) {
    switch (productType) {
        case 'SMARTPHONE':
            return randomChoice(SMARTPHONE_BRANDS)
        case 'LAPTOP':
        case 'TABLET':
            return randomChoice(LAPTOP_BRANDS)
        case 'AUDIO':
            return randomChoice(AUDIO_BRANDS)
        default:
            return randomChoice([
                'Apple',
                'Samsung',
                'Sony',
                'Microsoft',
                'Google',
            ])
    }
}

function generateProductName(productType, brand) {
    const models = {
        SMARTPHONE: ['Pro', 'Max', 'Plus', 'Mini', 'Ultra', 'Edge', 'Note'],
        LAPTOP: [
            'Pro',
            'Air',
            'Studio',
            'Elite',
            'Inspiron',
            'ThinkPad',
            'Pavilion',
        ],
        TABLET: ['Pro', 'Air', 'Mini', 'Surface', 'Tab'],
        AUDIO: ['Pro', 'Max', 'Studio', 'Buds', 'Elite', 'Freedom'],
        ACCESSORIES: ['Case', 'Cover', 'Stand', 'Charger', 'Cable', 'Adapter'],
        WEARABLE: ['Watch', 'Band', 'Tracker', 'Ring'],
        GAMING: ['Controller', 'Console', 'Headset', 'Keyboard'],
        SOFTWARE: ['Suite', 'Pro', 'Premium', 'Studio', 'Office'],
        SERVICES: ['Plan', 'Support', 'Care', 'Protection'],
    }

    const modelNames = models[productType] || ['Product']
    const model = randomChoice(modelNames)
    const series = randomInt(10, 15)

    return `${brand} ${model} ${series}`
}

// Main seeding function
async function main() {
    console.log('🌱 Starting database seeding...')
    console.log('📊 Configuration:', CONFIG)

    try {
        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🧹 Clearing existing data...')
        await prisma.inventoryActivity.deleteMany()
        await prisma.inventory.deleteMany()
        await prisma.review.deleteMany()
        await prisma.cartItem.deleteMany()
        await prisma.orderItem.deleteMany()
        await prisma.order.deleteMany()
        await prisma.product.deleteMany()
        await prisma.category.deleteMany()
        await prisma.warehouse.deleteMany()
        await prisma.token.deleteMany()
        await prisma.permission.deleteMany()
        await prisma.user.deleteMany()
        await prisma.role.deleteMany()

        // Seed in order (respecting foreign key constraints)
        await seedRoles()
        await seedUsers()
        await seedCategories()
        await seedWarehouses()
        await seedProducts()
        await seedInventory()
        await seedOrders()
        await seedCartItems()
        await seedReviews()

        console.log('🎉 Database seeding completed successfully!')
        console.log('📈 Summary:')
        console.log(`   👥 Users: ${CONFIG.users}`)
        console.log(`   📁 Categories: ${CONFIG.categories}`)
        console.log(`   📱 Products: ${CONFIG.products}`)
        console.log(`   🏭 Warehouses: ${CONFIG.warehouses}`)
        console.log(`   🛍️ Orders: ${CONFIG.orders}`)
        console.log(`   ⭐ Reviews: ${CONFIG.reviews}`)
        console.log(`   🛒 Cart Items: ${CONFIG.cartItems}`)
        console.log('')
        console.log('🔑 Test Credentials:')
        console.log('   Email: admin@bookscape.com')
        console.log('   Password: password')
    } catch (error) {
        console.error('❌ Error seeding database:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Run the seeding
main().catch((e) => {
    console.error('💥 Fatal error:', e)
    process.exit(1)
})
