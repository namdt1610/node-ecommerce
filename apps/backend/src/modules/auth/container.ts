import { AuthController } from './presentation/controllers/auth.controller'
import { RegisterUseCase } from './application/use-cases/register.usecase'
import { LoginUseCase } from './application/use-cases/login.usecase'
import { PrismaUserRepo } from '../user/infrastructure/repositories/user.repository'
import { BcryptHasher } from './infrastructure/services/bcypt-hasher'
import { JwtAccessTokenService } from './infrastructure/services/jwt-access-token-generator'
import { JwtRefreshTokenService } from './infrastructure/services/jwt-refresh-token-generator'
import { IAuthContainer } from './domain/interfaces/auth-container'

// Create DI Container
function createAuthContainer(): IAuthContainer {
    return {
        userRepository: new PrismaUserRepo(),
        passwordHasher: new BcryptHasher(),
        accessTokenGenerator: new JwtAccessTokenService(),
        refreshTokenGenerator: new JwtRefreshTokenService(),
    }
}

// Create Auth Controller with DI
export function createAuthController(): AuthController {
    const container = createAuthContainer()

    // Use Cases
    const registerUseCase = new RegisterUseCase(
        container.userRepository,
        container.passwordHasher,
        container.accessTokenGenerator,
        container.refreshTokenGenerator
    )
    const loginUseCase = new LoginUseCase(
        container.userRepository,
        container.passwordHasher,
        container.accessTokenGenerator,
        container.refreshTokenGenerator
    )

    // Controller
    return new AuthController(registerUseCase, loginUseCase)
}

// Export container for testing
export { createAuthContainer }
