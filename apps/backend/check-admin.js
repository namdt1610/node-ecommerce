const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkAdmin() {
    try {
        console.log('Checking admin user...')

        const admin = await prisma.user.findUnique({
            where: { email: 'admin@bookscape.com' },
            include: {
                role: {
                    include: {
                        permissions: true,
                    },
                },
            },
        })

        if (admin) {
            console.log('✅ Admin user found:')
            console.log('- Email:', admin.email)
            console.log('- Name:', admin.name)
            console.log('- Role:', admin.role.name)
            console.log('- Permissions:', admin.role.permissions.length)
            console.log('- Status:', admin.status)
        } else {
            console.log('❌ Admin user not found')
        }
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkAdmin()
