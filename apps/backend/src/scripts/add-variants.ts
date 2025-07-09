import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateProductsWithVariants() {
    try {
        // Get all products
        const products = await prisma.product.findMany()

        for (const product of products) {
            // Create sample variants for each product
            const variants = [
                {
                    id: `${product.id}-variant-1`,
                    name: `${product.name} - Space Gray 128GB`,
                    sku: `${product.id}-SG-128`,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    attributes: [
                        { name: 'Color', value: 'Space Gray' },
                        { name: 'Storage', value: '128GB' },
                    ],
                    inventory: {
                        quantity: 10,
                        reservedQuantity: 2,
                        availableQuantity: 8,
                        lowStockThreshold: 5,
                    },
                    isActive: true,
                },
                {
                    id: `${product.id}-variant-2`,
                    name: `${product.name} - Space Gray 256GB`,
                    sku: `${product.id}-SG-256`,
                    price: product.price + 100000,
                    originalPrice:
                        (product.originalPrice || product.price) + 100000,
                    attributes: [
                        { name: 'Color', value: 'Space Gray' },
                        { name: 'Storage', value: '256GB' },
                    ],
                    inventory: {
                        quantity: 15,
                        reservedQuantity: 3,
                        availableQuantity: 12,
                        lowStockThreshold: 5,
                    },
                    isActive: true,
                },
                {
                    id: `${product.id}-variant-3`,
                    name: `${product.name} - Natural Titanium 128GB`,
                    sku: `${product.id}-NT-128`,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    attributes: [
                        { name: 'Color', value: 'Natural Titanium' },
                        { name: 'Storage', value: '128GB' },
                    ],
                    inventory: {
                        quantity: 5,
                        reservedQuantity: 1,
                        availableQuantity: 4,
                        lowStockThreshold: 5,
                    },
                    isActive: true,
                },
                {
                    id: `${product.id}-variant-4`,
                    name: `${product.name} - Natural Titanium 256GB`,
                    sku: `${product.id}-NT-256`,
                    price: product.price + 100000,
                    originalPrice:
                        (product.originalPrice || product.price) + 100000,
                    attributes: [
                        { name: 'Color', value: 'Natural Titanium' },
                        { name: 'Storage', value: '256GB' },
                    ],
                    inventory: {
                        quantity: 8,
                        reservedQuantity: 0,
                        availableQuantity: 8,
                        lowStockThreshold: 5,
                    },
                    isActive: true,
                },
            ]

            // Update product with variants
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    variants: JSON.stringify(variants),
                },
            })

            console.log(`Updated product ${product.name} with variants`)
        }

        console.log('✅ All products updated with variants!')
    } catch (error) {
        console.error('❌ Error updating products:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateProductsWithVariants()
