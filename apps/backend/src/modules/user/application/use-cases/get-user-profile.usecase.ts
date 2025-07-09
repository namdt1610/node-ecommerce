import { IUserRepository } from '../../domain/interfaces/user-repository'
import { UserResponseDto } from '../dto/user-response.dto'
import { UserNotFoundError } from '../../domain/errors/user-not-found.error'

export class GetUserProfileUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(userId: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
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
        }
    }
}
