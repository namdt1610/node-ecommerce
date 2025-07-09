import prisma from '../config/database'

async function addSampleReviews() {
    try {
        console.log('Adding sample reviews...')

        // Get existing users and products
        const users = await prisma.user.findMany()
        const products = await prisma.product.findMany()

        if (users.length === 0) {
            console.log('No users found. Please run seed script first.')
            return
        }

        if (products.length === 0) {
            console.log('No products found. Please run seed script first.')
            return
        }

        console.log(
            `Found ${users.length} users and ${products.length} products`
        )

        // Sample reviews data
        const sampleReviews = [
            {
                rating: 5,
                comment:
                    'Sản phẩm rất tuyệt vời! Chất lượng xuất sắc, đóng gói cẩn thận. Tôi rất hài lòng với mua hàng này. Sẽ tiếp tục ủng hộ shop.',
            },
            {
                rating: 4,
                comment:
                    'Sản phẩm tốt, giá hợp lý. Giao hàng nhanh. Chỉ có điều bao bì hơi đơn giản. Nhìn chung vẫn recommend.',
            },
            {
                rating: 5,
                comment:
                    'Tuyệt vời! Đúng như mô tả, chất lượng cao. Nhân viên tư vấn nhiệt tình. Sẽ mua thêm sản phẩm khác.',
            },
            {
                rating: 3,
                comment:
                    'Sản phẩm ổn, không có gì đặc biệt. Giá cả hợp lý nhưng chất lượng cũng bình thường. Có thể cải thiện thêm.',
            },
            {
                rating: 4,
                comment:
                    'Mình mua làm quà tặng, người nhận rất thích. Chất lượng tốt, thiết kế đẹp. Giao hàng đúng hẹn.',
            },
            {
                rating: 5,
                comment:
                    'Lần đầu mua ở shop này và rất hài lòng. Sản phẩm chất lượng cao, service tốt. Chắc chắn sẽ quay lại.',
            },
            {
                rating: 4,
                comment:
                    'Sản phẩm đúng mô tả, chất lượng ổn. Giao hàng hơi chậm nhưng bù lại giá tốt. Sẽ cân nhắc mua lại.',
            },
            {
                rating: 2,
                comment:
                    'Sản phẩm không như mong đợi. Chất lượng kém hơn mô tả. Cần cải thiện về quality control.',
            },
        ]

        // Add reviews to different products
        for (let i = 0; i < Math.min(products.length, 3); i++) {
            const product = products[i]
            console.log(`Adding reviews for product: ${product.name}`)

            // Add 3-5 reviews per product
            const numReviews = 3 + Math.floor(Math.random() * 3)

            for (let j = 0; j < numReviews; j++) {
                const user = users[j % users.length]
                const reviewData = sampleReviews[j % sampleReviews.length]

                try {
                    await prisma.review.create({
                        data: {
                            userId: user.id,
                            productId: product.id,
                            rating: reviewData.rating,
                            comment: reviewData.comment,
                        },
                    })
                    console.log(
                        `Added review by ${user.name} for ${product.name}`
                    )
                } catch (error: any) {
                    if (error.code === 'P2002') {
                        console.log(
                            `Review already exists for user ${user.name} and product ${product.name}`
                        )
                    } else {
                        console.error('Error adding review:', error)
                    }
                }
            }
        }

        console.log('Sample reviews added successfully!')
    } catch (error) {
        console.error('Error adding sample reviews:', error)
    } finally {
        await prisma.$disconnect()
    }
}

addSampleReviews()
