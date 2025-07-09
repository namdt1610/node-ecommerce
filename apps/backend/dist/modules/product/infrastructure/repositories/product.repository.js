"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
class ProductRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.product.create({
            data,
            include: { category: true },
        });
    }
    async findById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
    }
    async findBySlug(slug) {
        return this.prisma.product.findUnique({
            where: { slug },
            include: { category: true },
        });
    }
    async findAll(params) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.product.findMany({
            skip,
            take,
            where,
            orderBy,
            include: { category: true },
        });
    }
    async update(id, data) {
        return this.prisma.product.update({
            where: { id },
            data,
            include: { category: true },
        });
    }
    async delete(id) {
        await this.prisma.product.delete({
            where: { id },
        });
    }
    async count(where) {
        return this.prisma.product.count({
            where,
        });
    }
}
exports.ProductRepository = ProductRepository;
