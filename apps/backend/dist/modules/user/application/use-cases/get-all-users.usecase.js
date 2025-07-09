"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersUseCase = void 0;
class GetAllUsersUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(params) {
        const { skip, take, search } = params || {};
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
            ];
        }
        const users = await this.userRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        });
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username || undefined,
            avatar: user.avatar || undefined,
            status: user.status,
            role: {
                id: user.role.id,
                name: user.role.name,
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }
}
exports.GetAllUsersUseCase = GetAllUsersUseCase;
