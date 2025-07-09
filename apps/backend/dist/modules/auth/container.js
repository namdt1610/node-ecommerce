"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthController = createAuthController;
exports.createAuthContainer = createAuthContainer;
const auth_controller_1 = require("./presentation/controllers/auth.controller");
const register_usecase_1 = require("./application/use-cases/register.usecase");
const login_usecase_1 = require("./application/use-cases/login.usecase");
const user_repository_1 = require("../user/infrastructure/repositories/user.repository");
const bcypt_hasher_1 = require("./infrastructure/services/bcypt-hasher");
const jwt_access_token_generator_1 = require("./infrastructure/services/jwt-access-token-generator");
const jwt_refresh_token_generator_1 = require("./infrastructure/services/jwt-refresh-token-generator");
// Create DI Container
function createAuthContainer() {
    return {
        userRepository: new user_repository_1.PrismaUserRepo(),
        passwordHasher: new bcypt_hasher_1.BcryptHasher(),
        accessTokenGenerator: new jwt_access_token_generator_1.JwtAccessTokenService(),
        refreshTokenGenerator: new jwt_refresh_token_generator_1.JwtRefreshTokenService(),
    };
}
// Create Auth Controller with DI
function createAuthController() {
    const container = createAuthContainer();
    // Use Cases
    const registerUseCase = new register_usecase_1.RegisterUseCase(container.userRepository, container.passwordHasher, container.accessTokenGenerator, container.refreshTokenGenerator);
    const loginUseCase = new login_usecase_1.LoginUseCase(container.userRepository, container.passwordHasher, container.accessTokenGenerator, container.refreshTokenGenerator);
    // Controller
    return new auth_controller_1.AuthController(registerUseCase, loginUseCase);
}
