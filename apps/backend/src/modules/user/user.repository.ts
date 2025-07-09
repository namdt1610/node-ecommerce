import { PrismaClient, User, Prisma } from '@prisma/client'
import prisma from '../../config/database'

export class UserRepository {
    private db: PrismaClient

    constructor() {
        this.db = prisma
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.db.user.create({
            data,
            include: {
                role: true,
            },
        })
    }

    async findById(id: string): Promise<User | null> {
        return this.db.user.findUnique({
            where: { id },
            include: {
                role: true,
            },
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.db.user.findUnique({
            where: { email },
            include: {
                role: true,
            },
        })
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.db.user.findUnique({
            where: { username },
            include: {
                role: true,
            },
        })
    }

    async findAll(params?: {
        skip?: number
        take?: number
        orderBy?: Prisma.UserOrderByWithRelationInput
        where?: Prisma.UserWhereInput
    }): Promise<User[]> {
        const { skip, take, orderBy, where } = params || {}
        return this.db.user.findMany({
            skip,
            take,
            orderBy,
            where,
            include: {
                role: true,
            },
        })
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.db.user.update({
            where: { id },
            data,
            include: {
                role: true,
            },
        })
    }

    async delete(id: string): Promise<User> {
        return this.db.user.delete({
            where: { id },
        })
    }

    async count(where?: Prisma.UserWhereInput): Promise<number> {
        return this.db.user.count({ where })
    }
}
