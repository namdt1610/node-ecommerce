import { IUserRepository } from '../../domain/interfaces/user-repository'
import { UserResponseDto } from '../dto/user-response.dto'

export class GetAllUsersUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(params?: {
        skip?: number
        take?: number
        search?: string
    }): Promise<UserResponseDto[]> {
        const { skip, take, search } = params || {}
        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
            ]
        }

        const users = await this.userRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        })

        return users.map((user) => ({
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
        }))
    }
}
