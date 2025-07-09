import { IUserRepository } from '../../../user/domain/interfaces/user-repository'
import { IPasswordHasher } from './password-hasher'
import { IJwtAccessTokenGenerator } from './jwt-access-token-generator'
import { IJwtRefreshTokenGenerator } from './jwt-refresh-token-generator'

// DI Container Interface
export interface IAuthContainer {
    userRepository: IUserRepository
    passwordHasher: IPasswordHasher
    accessTokenGenerator: IJwtAccessTokenGenerator
    refreshTokenGenerator: IJwtRefreshTokenGenerator
}

// Factory type for creating container
export type AuthContainerFactory = () => IAuthContainer
