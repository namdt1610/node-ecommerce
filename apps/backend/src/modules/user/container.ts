import { UserController } from './presentation/controllers/user.controller'
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.usecase'
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.usecase'
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.usecase'
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase'
import { PrismaUserRepo } from './infrastructure/repositories/user.repository'
import { IUserContainer } from './domain/interfaces/user-container'

// Create DI Container
function createUserContainer(): IUserContainer {
    return {
        userRepository: new PrismaUserRepo(),
        getUserProfileUseCase: new GetUserProfileUseCase(new PrismaUserRepo()),
        updateUserProfileUseCase: new UpdateUserProfileUseCase(
            new PrismaUserRepo()
        ),
        getAllUsersUseCase: new GetAllUsersUseCase(new PrismaUserRepo()),
        deleteUserUseCase: new DeleteUserUseCase(new PrismaUserRepo()),
    }
}

// Create User Controller with DI
export function createUserController(): UserController {
    const container = createUserContainer()

    return new UserController(
        container.getUserProfileUseCase,
        container.updateUserProfileUseCase,
        container.getAllUsersUseCase,
        container.deleteUserUseCase
    )
}

// Export container for testing
export { createUserContainer }
