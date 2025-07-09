"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const invalid_credentials_error_1 = require("../../domain/errors/invalid-credentials-error");
class LoginUseCase {
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
        const existing = await this.userRepo.findByEmail(dto.email);
        if (!existing) {
            throw new invalid_credentials_error_1.InvalidCredentialsError();
        }
        const isMatch = await this.passwordHasher.verify(dto.password, existing.password);
        if (!isMatch) {
            throw new invalid_credentials_error_1.InvalidCredentialsError();
        }
        const accessToken = this.accessGen.generate(existing.id);
        const refreshToken = this.refreshGen.generate(existing.id);
        return {
            user: this.mapUser(existing),
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
exports.LoginUseCase = LoginUseCase;
