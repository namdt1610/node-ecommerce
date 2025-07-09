import { IUserRepository } from '../../domain/interfaces/user-repository'
import { UpdateUserDto, UserResponseDto } from '../dto'
import { UserNotFoundError } from '../../domain/errors/user-not-found.error'

export class UpdateUserProfileUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(
        userId: string,
        dto: UpdateUserDto
    ): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findById(userId)

        if (!existingUser) {
            throw new UserNotFoundError(userId)
        }

        const updatedUser = await this.userRepository.update(userId, dto)

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
        }
    }
}
