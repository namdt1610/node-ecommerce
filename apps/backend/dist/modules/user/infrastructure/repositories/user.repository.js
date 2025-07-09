"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepo = void 0;
const client_1 = require("@prisma/client");
class PrismaUserRepo {
    prisma;
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async findByEmail(email) {
        const normalizedEmail = email.toLowerCase().trim();
        return this.prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { role: true },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
    }
    async findAll(params) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.user.findMany({
            skip,
            take,
            where,
            orderBy,
            include: { role: true },
        });
    }
    async create(data) {
        // Validate required fields
        if (!data.email) {
            throw new Error('Email is required');
        }
        if (!data.password) {
            throw new Error('Password is required');
        }
        // Get default role if not provided
        const defaultRole = await this.prisma.role.findFirst({
            where: { name: 'user' },
        });
        if (!defaultRole) {
            throw new Error('Default role not found');
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
        });
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
            include: {
                role: true,
            },
        });
    }
    async delete(id) {
        await this.prisma.user.delete({ where: { id } });
    }
}
exports.PrismaUserRepo = PrismaUserRepo;
