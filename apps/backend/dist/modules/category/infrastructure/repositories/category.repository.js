"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
class CategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.category.create({
            data,
        });
    }
    async findById(id) {
        return this.prisma.category.findUnique({
            where: { id },
        });
    }
    async findByName(name) {
        return this.prisma.category.findUnique({
            where: { name },
        });
    }
    async findBySlug(slug) {
        return this.prisma.category.findUnique({
            where: { slug },
        });
    }
    async findAll(params) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.category.findMany({
            skip,
            take,
            where,
            orderBy,
        });
    }
    async update(id, data) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await this.prisma.category.delete({
            where: { id },
        });
    }
    async count(where) {
        return this.prisma.category.count({
            where,
        });
    }
}
exports.CategoryRepository = CategoryRepository;
