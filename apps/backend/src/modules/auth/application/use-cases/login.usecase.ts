import { AuthResponseDto, LoginDto } from '../dto'
import { IUserRepository } from '../../../user/domain/interfaces/user-repository'
import { IPasswordHasher } from '../../domain/interfaces/password-hasher'
import { IJwtAccessTokenGenerator } from '../../domain/interfaces/jwt-access-token-generator'
import { IJwtRefreshTokenGenerator } from '../../domain/interfaces/jwt-refresh-token-generator'
import { User, Role } from '@prisma/client'
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials-error'
import { BaseCommandUseCase } from '@/common'

type UserWithRole = User & { role: Role }

export class LoginUseCase extends BaseCommandUseCase<
    LoginDto,
    AuthResponseDto
> {
    constructor(
        private userRepo: IUserRepository,
        private passwordHasher: IPasswordHasher,
        private accessGen: IJwtAccessTokenGenerator,
        private refreshGen: IJwtRefreshTokenGenerator
    ) {
        super()
    }

    protected async validateBusinessRules(dto: LoginDto): Promise<void> {
        const existing = await this.userRepo.findByEmail(dto.email)
        if (!existing) {
            throw new InvalidCredentialsError()
        }

        const isMatch = await this.passwordHasher.verify(
            dto.password,
            existing.password
        )
        if (!isMatch) {
            throw new InvalidCredentialsError()
        }
    }

    protected async performCommand(dto: LoginDto): Promise<AuthResponseDto> {
        const existing = (await this.userRepo.findByEmail(
            dto.email
        )) as UserWithRole

        const accessToken = this.accessGen.generate(existing.id)
        const refreshToken = this.refreshGen.generate(existing.id)

        return {
            user: this.mapUser(existing),
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
