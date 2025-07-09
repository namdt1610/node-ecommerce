"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class OrderRepository {
    db;
    constructor() {
        this.db = database_1.default;
    }
    async create(data) {
        return this.db.order.create({
            data,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
    }
    async findById(id) {
        return this.db.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
    }
    async findAll(params) {
        const { skip, take, orderBy, where } = params || {};
        return this.db.order.findMany({
            skip,
            take,
            orderBy,
            where,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
    }
    async update(id, data) {
        return this.db.order.update({
            where: { id },
            data,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
    }
    async delete(id) {
        return this.db.order.delete({
            where: { id },
        });
    }
    async count(where) {
        return this.db.order.count({ where });
    }
}
exports.OrderRepository = OrderRepository;
