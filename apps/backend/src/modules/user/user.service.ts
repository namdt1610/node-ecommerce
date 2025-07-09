import { UserRepository } from './user.repository'
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto'
import { User, Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

type UserWithRole = User & { role: Role }

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const { password, ...userData } = createUserDto

        const hashedPassword = await bcrypt.hash(password, 10)

        const existingUser = await this.userRepository.findByEmail(
            createUserDto.email
        )
        if (existingUser) {
            throw new Error('User already exists')
        }

        const user = (await this.userRepository.create({
            ...userData,
            password: hashedPassword,
            role: {
                connect: { id: createUserDto.roleId },
            },
        })) as UserWithRole

        return this.mapToResponseDto(user)
    }

    async getUserById(id: string): Promise<UserResponseDto | null> {
        const user = (await this.userRepository.findById(
            id
        )) as UserWithRole | null
        if (!user) {
            return null
        }
        return this.mapToResponseDto(user)
    }

    async getUserByEmail(email: string): Promise<UserResponseDto | null> {
        const user = (await this.userRepository.findByEmail(
            email
        )) as UserWithRole | null
        if (!user) {
            return null
        }
        return this.mapToResponseDto(user)
    }

    async getAllUsers(params?: {
        skip?: number
        take?: number
        search?: string
    }): Promise<UserResponseDto[]> {
        const { skip, take, search } = params || {}

        const where = search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          email: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          username: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : undefined

        const users = (await this.userRepository.findAll({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        })) as UserWithRole[]

        return users.map((user) => this.mapToResponseDto(user))
    }

    async updateUser(
        id: string,
        updateUserDto: UpdateUserDto
    ): Promise<UserResponseDto> {
        const updateData: any = { ...updateUserDto }

        if (updateUserDto.roleId) {
            updateData.role = {
                connect: { id: updateUserDto.roleId },
            }
            delete updateData.roleId
        }

        const user = (await this.userRepository.update(
            id,
            updateData
        )) as UserWithRole
        return this.mapToResponseDto(user)
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id)
    }

    async getUsersCount(search?: string): Promise<number> {
        const where = search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          email: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          username: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : undefined

        return this.userRepository.count(where)
    }

    private mapToResponseDto(user: UserWithRole): UserResponseDto {
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
            favorites: user.favorites,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }
}
