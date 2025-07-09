import { IUserRepository } from './user-repository'
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.usecase'
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.usecase'
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.usecase'
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.usecase'

// DI Container Interface
export interface IUserContainer {
    userRepository: IUserRepository
    getUserProfileUseCase: GetUserProfileUseCase
    updateUserProfileUseCase: UpdateUserProfileUseCase
    getAllUsersUseCase: GetAllUsersUseCase
    deleteUserUseCase: DeleteUserUseCase
}

// Factory type for creating container
export type UserContainerFactory = () => IUserContainer
