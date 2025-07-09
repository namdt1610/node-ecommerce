"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfileUseCase = void 0;
const user_not_found_error_1 = require("../../domain/errors/user-not-found.error");
class UpdateUserProfileUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, dto) {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new user_not_found_error_1.UserNotFoundError(userId);
        }
        const updatedUser = await this.userRepository.update(userId, dto);
        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            username: updatedUser.username || undefined,
            avatar: updatedUser.avatar || undefined,
            status: updatedUser.status,
            role: {
                id: updatedUser.role.id,
                name: updatedUser.role.name,
            },
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
    }
}
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase;
