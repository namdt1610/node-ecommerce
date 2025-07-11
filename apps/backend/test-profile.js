const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testUserProfile() {
    try {
        console.log('Testing user profile query...')

        // Test finding admin user
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@bookscape.com' },
            include: {
                role: true,
            },
        })

        if (admin) {
            console.log('✅ Admin user found with role:')
            console.log('- ID:', admin.id)
            console.log('- Email:', admin.email)
            console.log('- Name:', admin.name)
            console.log('- Role ID:', admin.role?.id)
            console.log('- Role Name:', admin.role?.name)

            // Test findById with admin ID
            const userById = await prisma.user.findUnique({
                where: { id: admin.id },
                include: { role: true },
            })

            console.log('✅ User by ID query successful:', !!userById)
        } else {
            console.log('❌ Admin user not found')
        }
    } catch (error) {
        console.error('❌ Database error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testUserProfile()
