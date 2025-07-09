import { IUserRepository } from '../../domain/interfaces/user-repository'
import { UserNotFoundError } from '../../domain/errors/user-not-found.error'

export class DeleteUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(userId: string): Promise<void> {
        const existingUser = await this.userRepository.findById(userId)

        if (!existingUser) {
            throw new UserNotFoundError(userId)
        }

        await this.userRepository.delete(userId)
    }
}
