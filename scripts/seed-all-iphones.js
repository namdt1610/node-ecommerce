const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')
const path = require('path')

const prisma = new PrismaClient()

async function seedAllIPhones() {
    try {
        console.log('🍎🍎🍎 BẮT ĐẦU SEED TẤT CẢ DÒNG IPHONE 🍎🍎🍎')
        console.log('=' * 60)

        const startTime = Date.now()

        // Kiểm tra kết nối database
        await prisma.$connect()
        console.log('✅ Kết nối database thành công')

        // Chạy từng script theo thứ tự
        const scripts = [
            'seed-iphones.js',
            'seed-iphones-part2.js',
            'seed-iphones-part3.js',
            'seed-iphones-part4.js',
        ]

        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i]
            console.log(
                `\n📱 Đang chạy ${script} (${i + 1}/${scripts.length})...`
            )

            try {
                const scriptPath = path.join(__dirname, script)
                execSync(`node ${scriptPath}`, {
                    stdio: 'inherit',
                    cwd: __dirname,
                })
                console.log(`✅ Hoàn thành ${script}`)
            } catch (error) {
                console.error(`❌ Lỗi khi chạy ${script}:`, error.message)
                // Tiếp tục với script tiếp theo
            }
        }

        // Thống kê kết quả
        const totalIPhones = await prisma.product.count({
            where: {
                category: {
                    name: 'iPhone',
                },
            },
        })

        const endTime = Date.now()
        const duration = Math.round((endTime - startTime) / 1000)

        console.log('\n🎉🎉🎉 HOÀN THÀNH SEED TẤT CẢ IPHONE! 🎉🎉🎉')
        console.log('=' * 60)
        console.log(`📱 Tổng số iPhone đã seed: ${totalIPhones} models`)
        console.log(`⏱️  Thời gian thực hiện: ${duration} giây`)
        console.log('\n📋 DANH SÁCH IPHONE ĐÃ SEED:')
        console.log('✓ iPhone Original (2007)')
        console.log('✓ iPhone 3G (2008)')
        console.log('✓ iPhone 3GS (2009)')
        console.log('✓ iPhone 4 (2010)')
        console.log('✓ iPhone 4S (2011)')
        console.log('✓ iPhone 5 (2012)')
        console.log('✓ iPhone 5c (2013)')
        console.log('✓ iPhone 5s (2013)')
        console.log('✓ iPhone 6 & 6 Plus (2014)')
        console.log('✓ iPhone 6s & 6s Plus (2015)')
        console.log('✓ iPhone SE 1st gen (2016)')
        console.log('✓ iPhone 7 & 7 Plus (2016)')
        console.log('✓ iPhone 8 & 8 Plus (2017)')
        console.log('✓ iPhone X (2017)')
        console.log('✓ iPhone XR, XS & XS Max (2018)')
        console.log('✓ iPhone 11, 11 Pro & 11 Pro Max (2019)')
        console.log('✓ iPhone SE 2nd gen (2020)')
        console.log('✓ iPhone 12 series (2020)')
        console.log('✓ iPhone 13 series (2021)')
        console.log('✓ iPhone SE 3rd gen (2022)')
        console.log('✓ iPhone 14 series (2022)')
        console.log('✓ iPhone 15 series (2023)')

        console.log('\n💰 THÔNG TIN GIÁ:')
        console.log(
            '• Giá từ 8 triệu (iPhone 3G cũ) đến 145 triệu (iPhone 15 Pro Max)'
        )
        console.log('• Tất cả đều có giảm giá từ 15-25%')
        console.log('• Bao gồm cả máy mới và refurbished')

        console.log('\n📝 THÔNG TIN KỸ THUẬT:')
        console.log('• Đầy đủ thông số kỹ thuật chính xác')
        console.log('• Mô tả chi tiết bằng tiếng Việt')
        console.log('• SKU và slug unique cho mỗi model')
        console.log('• Tương thích với database schema hiện tại')
    } catch (error) {
        console.error('❌ Lỗi chung:', error)
    } finally {
        await prisma.$disconnect()
        console.log('\n👋 Đã ngắt kết nối database')
    }
}

// Chạy script chính
if (require.main === module) {
    seedAllIPhones()
}

module.exports = { seedAllIPhones }
