"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserProfileUseCase = void 0;
const user_not_found_error_1 = require("../../domain/errors/user-not-found.error");
class GetUserProfileUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new user_not_found_error_1.UserNotFoundError(userId);
        }
        return {
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
        };
    }
}
exports.GetUserProfileUseCase = GetUserProfileUseCase;
