"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class CategoryRepository {
    db;
    constructor() {
        this.db = database_1.default;
    }
    async create(data) {
        return this.db.category.create({ data });
    }
    async findById(id) {
        return this.db.category.findUnique({
            where: { id },
        });
    }
    async findByName(name) {
        return this.db.category.findUnique({
            where: { name },
        });
    }
    async findBySlug(slug) {
        return this.db.category.findUnique({
            where: { slug },
        });
    }
    async findAll(params) {
        const { skip, take, orderBy, where } = params || {};
        return this.db.category.findMany({
            skip,
            take,
            orderBy,
            where,
        });
    }
    async update(id, data) {
        return this.db.category.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.db.category.delete({
            where: { id },
        });
    }
    async count(where) {
        return this.db.category.count({ where });
    }
}
exports.CategoryRepository = CategoryRepository;
