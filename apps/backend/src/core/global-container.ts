import { PrismaClient } from '@prisma/client'
import { BaseContainer } from './base-container'

/**
 * Kế thừa class BaseContainer chỉ giúp có sẵn phương thức register, resolve,
 * nhưng KHÔNG mang theo dữ liệu đã đăng ký từ global đâu.
 */
export class GlobalContainer extends BaseContainer {
    constructor() {
        super()
        const prisma = new PrismaClient()
        this.register('prisma', prisma)
    }
}
