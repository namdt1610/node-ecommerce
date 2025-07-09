"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class ProductRepository {
    db;
    constructor() {
        this.db = database_1.default;
    }
    async create(data) {
        return this.db.product.create({
            data,
            include: {
                category: true,
            },
        });
    }
    async findById(id) {
        return this.db.product.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: true,
            },
        });
    }
    async findAll(params) {
        const { skip, take, orderBy, where } = params || {};
        return this.db.product.findMany({
            skip,
            take,
            orderBy,
            where,
            include: {
                category: true,
            },
        });
    }
    async update(id, data) {
        return this.db.product.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        });
    }
    async delete(id) {
        return this.db.product.delete({
            where: { id },
        });
    }
    async count(where) {
        return this.db.product.count({ where });
    }
}
exports.ProductRepository = ProductRepository;
