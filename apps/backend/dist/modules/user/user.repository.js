"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class UserRepository {
    db;
    constructor() {
        this.db = database_1.default;
    }
    async create(data) {
        return this.db.user.create({
            data,
            include: {
                role: true,
            },
        });
    }
    async findById(id) {
        return this.db.user.findUnique({
            where: { id },
            include: {
                role: true,
            },
        });
    }
    async findByEmail(email) {
        return this.db.user.findUnique({
            where: { email },
            include: {
                role: true,
            },
        });
    }
    async findByUsername(username) {
        return this.db.user.findUnique({
            where: { username },
            include: {
                role: true,
            },
        });
    }
    async findAll(params) {
        const { skip, take, orderBy, where } = params || {};
        return this.db.user.findMany({
            skip,
            take,
            orderBy,
            where,
            include: {
                role: true,
            },
        });
    }
    async update(id, data) {
        return this.db.user.update({
            where: { id },
            data,
            include: {
                role: true,
            },
        });
    }
    async delete(id) {
        return this.db.user.delete({
            where: { id },
        });
    }
    async count(where) {
        return this.db.user.count({ where });
    }
}
exports.UserRepository = UserRepository;
