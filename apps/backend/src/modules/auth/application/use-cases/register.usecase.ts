import { RegisterDto, AuthResponseDto } from '../dto'
import { IUserRepository } from '../../../user/domain/interfaces/user-repository'
import { IPasswordHasher } from '../../domain/interfaces/password-hasher'
import { IJwtAccessTokenGenerator } from '../../domain/interfaces/jwt-access-token-generator'
import { IJwtRefreshTokenGenerator } from '../../domain/interfaces/jwt-refresh-token-generator'
import { User, Role } from '@prisma/client'
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists'

type UserWithRole = User & { role: Role }

export class RegisterUseCase {
    constructor(
        private userRepo: IUserRepository,
        private passwordHasher: IPasswordHasher,
        private accessGen: IJwtAccessTokenGenerator,
        private refreshGen: IJwtRefreshTokenGenerator
    ) {}

    async execute(dto: RegisterDto): Promise<AuthResponseDto> {
        // Validate password confirmation
        if (dto.password !== dto.confirmPassword) {
            throw new Error('Passwords do not match')
        }

        const existing = await this.userRepo.findByEmail(dto.email)
        if (existing) {
            throw new UserAlreadyExistsError(dto.email)
        }

        const hashed = await this.passwordHasher.hash(dto.password)

        const createdUser = (await this.userRepo.create({
            email: dto.email,
            password: hashed,
        })) as UserWithRole

        const accessToken = this.accessGen.generate(createdUser.id)
        const refreshToken = this.refreshGen.generate(createdUser.id)

        return {
            user: this.mapUser(createdUser),
            accessToken,
            refreshToken,
        }
    }

    private mapUser(user: UserWithRole) {
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
        }
    }
}
