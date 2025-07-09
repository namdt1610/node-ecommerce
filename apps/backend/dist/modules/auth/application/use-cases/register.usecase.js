"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const user_already_exists_1 = require("../../domain/errors/user-already-exists");
class RegisterUseCase {
    userRepo;
    passwordHasher;
    accessGen;
    refreshGen;
    constructor(userRepo, passwordHasher, accessGen, refreshGen) {
        this.userRepo = userRepo;
        this.passwordHasher = passwordHasher;
        this.accessGen = accessGen;
        this.refreshGen = refreshGen;
    }
    async execute(dto) {
        // Validate password confirmation
        if (dto.password !== dto.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing) {
            throw new user_already_exists_1.UserAlreadyExistsError(dto.email);
        }
        const hashed = await this.passwordHasher.hash(dto.password);
        const createdUser = (await this.userRepo.create({
            email: dto.email,
            password: hashed,
        }));
        const accessToken = this.accessGen.generate(createdUser.id);
        const refreshToken = this.refreshGen.generate(createdUser.id);
        return {
            user: this.mapUser(createdUser),
            accessToken,
            refreshToken,
        };
    }
    mapUser(user) {
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
        };
    }
}
exports.RegisterUseCase = RegisterUseCase;
