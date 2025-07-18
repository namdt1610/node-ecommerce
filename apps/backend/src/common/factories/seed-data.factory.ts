import { FormatUtils } from '../utils/format.utils'

/**
 * Factory for generating consistent seed data
 */
export class SeedDataFactory {
    private static readonly DEFAULT_PASSWORD = 'DefaultPass123!'
    private static readonly LOREM_WORDS = [
        'lorem',
        'ipsum',
        'dolor',
        'sit',
        'amet',
        'consectetur',
        'adipiscing',
        'elit',
        'sed',
        'do',
        'eiusmod',
        'tempor',
        'incididunt',
        'ut',
        'labore',
        'et',
        'dolore',
        'magna',
        'aliqua',
        'enim',
        'ad',
        'minim',
        'veniam',
        'quis',
        'nostrud',
    ]

    /**
     * Generate user seed data
     */
    static createUser(overrides: Partial<any> = {}): any {
        const firstName = this.randomChoice([
            'Nguyen',
            'Tran',
            'Le',
            'Pham',
            'Hoang',
        ])
        const lastName = this.randomChoice([
            'Van A',
            'Thi B',
            'Van C',
            'Thi D',
            'Van E',
        ])
        const email =
            overrides.email ||
            `${FormatUtils.slugify(firstName + lastName)}@example.com`

        return {
            email,
            password: this.DEFAULT_PASSWORD,
            firstName,
            lastName,
            phone: this.generatePhoneNumber(),
            dateOfBirth: this.generateRandomDate(
                new Date('1980-01-01'),
                new Date('2000-12-31')
            ),
            isActive: true,
            role: 'USER',
            ...overrides,
        }
    }

    /**
     * Generate admin user seed data
     */
    static createAdmin(overrides: Partial<any> = {}): any {
        return this.createUser({
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            isAdmin: true,
            ...overrides,
        })
    }

    /**
     * Generate category seed data
     */
    static createCategory(overrides: Partial<any> = {}): any {
        const names = [
            'Electronics',
            'Clothing',
            'Books',
            'Home & Garden',
            'Sports',
            'Toys',
        ]
        const name = overrides.name || this.randomChoice(names)

        return {
            name,
            slug: FormatUtils.slugify(name),
            description: this.generateDescription(),
            image: this.generateImageUrl(),
            isActive: true,
            sortOrder: this.randomNumber(1, 100),
            ...overrides,
        }
    }

    /**
     * Generate product seed data
     */
    static createProduct(overrides: Partial<any> = {}): any {
        const productNames = [
            'Smartphone Pro Max',
            'Laptop Gaming',
            'Wireless Headphones',
            'Smart Watch',
            'Tablet Ultra',
            'Camera DSLR',
            'Speaker Bluetooth',
            'Mouse Gaming',
            'Keyboard Mechanical',
            'Monitor 4K',
        ]

        const name = overrides.name || this.randomChoice(productNames)
        const price = overrides.price || this.randomNumber(100000, 50000000)

        return {
            name,
            slug: FormatUtils.slugify(name),
            description: this.generateDescription(50, 200),
            shortDescription: this.generateDescription(10, 30),
            price,
            comparePrice: Math.floor(price * 1.2),
            cost: Math.floor(price * 0.7),
            sku: this.generateSKU(),
            barcode: this.generateBarcode(),
            stock: this.randomNumber(0, 1000),
            weight: this.randomNumber(100, 5000),
            dimensions: {
                length: this.randomNumber(10, 100),
                width: this.randomNumber(10, 100),
                height: this.randomNumber(5, 50),
            },
            images: this.generateProductImages(),
            isActive: true,
            isFeatured: Math.random() > 0.8,
            tags: this.generateTags(),
            seoTitle: name,
            seoDescription: this.generateDescription(20, 50),
            ...overrides,
        }
    }

    /**
     * Generate order seed data
     */
    static createOrder(overrides: Partial<any> = {}): any {
        const statuses = [
            'PENDING',
            'CONFIRMED',
            'PROCESSING',
            'SHIPPED',
            'DELIVERED',
            'CANCELLED',
        ]
        const paymentMethods = [
            'CREDIT_CARD',
            'PAYPAL',
            'BANK_TRANSFER',
            'CASH_ON_DELIVERY',
        ]

        return {
            orderNumber: FormatUtils.generateOrderNumber(),
            status: this.randomChoice(statuses),
            paymentStatus: 'PAID',
            paymentMethod: this.randomChoice(paymentMethods),
            subtotal: this.randomNumber(100000, 5000000),
            tax: 0,
            shipping: this.randomNumber(20000, 100000),
            discount: 0,
            total: 0, // Will be calculated
            currency: 'VND',
            notes: this.randomChoice([
                '',
                '',
                '',
                'Giao hàng nhanh',
                'Gọi trước khi giao',
            ]),
            shippingAddress: this.createAddress(),
            billingAddress: this.createAddress(),
            ...overrides,
        }
    }

    /**
     * Generate address seed data
     */
    static createAddress(overrides: Partial<any> = {}): any {
        const streets = [
            'Nguyen Hue',
            'Le Loi',
            'Hai Ba Trung',
            'Tran Hung Dao',
            'Bach Dang',
        ]
        const cities = [
            'Ho Chi Minh',
            'Ha Noi',
            'Da Nang',
            'Can Tho',
            'Vung Tau',
        ]

        return {
            fullName: 'Nguyen Van A',
            phone: this.generatePhoneNumber(),
            street: `${this.randomNumber(1, 999)} ${this.randomChoice(streets)}`,
            city: this.randomChoice(cities),
            state: 'Vietnam',
            zipCode: this.randomNumber(10000, 99999).toString(),
            country: 'VN',
            isDefault: false,
            ...overrides,
        }
    }

    /**
     * Generate review seed data
     */
    static createReview(overrides: Partial<any> = {}): any {
        const comments = [
            'Sản phẩm tốt, đáng tiền',
            'Chất lượng OK, giao hàng nhanh',
            'Rất hài lòng với sản phẩm',
            'Đóng gói cẩn thận, sản phẩm đẹp',
            'Sẽ mua lại lần sau',
        ]

        return {
            rating: this.randomNumber(3, 5),
            comment: this.randomChoice(comments),
            isVerified: Math.random() > 0.3,
            isHelpful: this.randomNumber(0, 10),
            ...overrides,
        }
    }

    /**
     * Generate inventory seed data
     */
    static createInventory(overrides: Partial<any> = {}): any {
        return {
            quantity: this.randomNumber(0, 1000),
            reserved: this.randomNumber(0, 50),
            available: 0, // Will be calculated
            reorderPoint: this.randomNumber(10, 100),
            maxStock: this.randomNumber(500, 2000),
            cost: this.randomNumber(50000, 1000000),
            location: `A${this.randomNumber(1, 10)}-B${this.randomNumber(1, 20)}`,
            ...overrides,
        }
    }

    // Helper methods
    private static randomChoice<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)]
    }

    private static randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    private static generatePhoneNumber(): string {
        const prefixes = [
            '090',
            '091',
            '094',
            '083',
            '084',
            '085',
            '081',
            '082',
        ]
        const prefix = this.randomChoice(prefixes)
        const suffix = this.randomNumber(1000000, 9999999)
        return `${prefix}${suffix}`
    }

    private static generateDescription(
        minWords: number = 10,
        maxWords: number = 50
    ): string {
        const wordCount = this.randomNumber(minWords, maxWords)
        const words = []

        for (let i = 0; i < wordCount; i++) {
            words.push(this.randomChoice(this.LOREM_WORDS))
        }

        return FormatUtils.capitalize(words.join(' ')) + '.'
    }

    private static generateSKU(): string {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const numbers = '0123456789'

        let sku = ''
        for (let i = 0; i < 3; i++) {
            sku += letters.charAt(Math.floor(Math.random() * letters.length))
        }
        sku += '-'
        for (let i = 0; i < 6; i++) {
            sku += numbers.charAt(Math.floor(Math.random() * numbers.length))
        }

        return sku
    }

    private static generateBarcode(): string {
        let barcode = ''
        for (let i = 0; i < 13; i++) {
            barcode += this.randomNumber(0, 9).toString()
        }
        return barcode
    }

    private static generateImageUrl(): string {
        const width = this.randomChoice([400, 500, 600, 800])
        const height = this.randomChoice([300, 400, 500, 600])
        return `https://picsum.photos/${width}/${height}?random=${Math.random()}`
    }

    private static generateProductImages(): string[] {
        const count = this.randomNumber(1, 5)
        const images = []

        for (let i = 0; i < count; i++) {
            images.push(this.generateImageUrl())
        }

        return images
    }

    private static generateTags(): string[] {
        const allTags = [
            'new',
            'popular',
            'sale',
            'premium',
            'limited',
            'bestseller',
            'eco-friendly',
            'handmade',
            'vintage',
            'modern',
            'classic',
        ]

        const count = this.randomNumber(0, 4)
        const tags: string[] = []

        for (let i = 0; i < count; i++) {
            const tag = this.randomChoice(allTags)
            if (!tags.includes(tag)) {
                tags.push(tag)
            }
        }

        return tags
    }

    private static generateRandomDate(start: Date, end: Date): Date {
        return new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime())
        )
    }

    /**
     * Generate multiple records
     */
    static generateMultiple<T>(factory: () => T, count: number): T[] {
        const items = []
        for (let i = 0; i < count; i++) {
            items.push(factory())
        }
        return items
    }

    /**
     * Generate batch of related data
     */
    static generateBatch() {
        return {
            categories: this.generateMultiple(() => this.createCategory(), 10),
            users: this.generateMultiple(() => this.createUser(), 50),
            admins: [this.createAdmin()],
            products: this.generateMultiple(() => this.createProduct(), 100),
            orders: this.generateMultiple(() => this.createOrder(), 200),
            reviews: this.generateMultiple(() => this.createReview(), 500),
        }
    }
}
