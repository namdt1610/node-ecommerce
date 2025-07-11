import { PrismaClient, Role, User, Prisma } from '@prisma/client'
import { IUserRepository } from '../../domain/interfaces/user-repository'
import prisma from '@/config/database'

type UserWithRole = User & { role: Role }

export class PrismaUserRepo implements IUserRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = prisma
    }

    async findByEmail(email: string): Promise<UserWithRole | null> {
        const normalizedEmail = email.toLowerCase().trim()

        return this.prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { role: true },
        })
    }

    async findById(id: string): Promise<UserWithRole | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: { role: true },
        })
    }

    async findAll(params?: {
        skip?: number
        take?: number
        where?: Prisma.UserWhereInput
        orderBy?: Prisma.UserOrderByWithRelationInput
    }): Promise<UserWithRole[]> {
        const { skip, take, where, orderBy } = params || {}

        return this.prisma.user.findMany({
            skip,
            take,
            where,
            orderBy,
            include: { role: true },
        }) as Promise<UserWithRole[]>
    }

    async create(data: Partial<User>): Promise<UserWithRole> {
        // Validate required fields
        if (!data.email) {
            throw new Error('Email is required')
        }
        if (!data.password) {
            throw new Error('Password is required')
        }

        // Get default role if not provided
        const defaultRole = await this.prisma.role.findFirst({
            where: { name: 'user' },
        })

        if (!defaultRole) {
            throw new Error('Default role not found')
        }

        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                username: data.username || null,
                avatar: data.avatar || null,
                status: data.status ?? 'ACTIVE',
                roleId: defaultRole.id,
            },
            include: {
                role: true,
            },
        }) as Promise<UserWithRole>
    }

    async update(id: string, data: Partial<User>): Promise<UserWithRole> {
        return this.prisma.user.update({
            where: { id },
            data,
            include: {
                role: true,
            },
        }) as Promise<UserWithRole>
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } })
    }
}
