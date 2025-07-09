"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserUseCase = void 0;
const user_not_found_error_1 = require("../../domain/errors/user-not-found.error");
class DeleteUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new user_not_found_error_1.UserNotFoundError(userId);
        }
        await this.userRepository.delete(userId);
    }
}
exports.DeleteUserUseCase = DeleteUserUseCase;
