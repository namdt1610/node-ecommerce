import { User, Role, Prisma } from '@prisma/client'

export interface IUserRepository {
    findByEmail(email: string): Promise<(User & { role: Role }) | null>
    findById(id: string): Promise<(User & { role: Role }) | null>
    findAll(params?: {
        skip?: number
        take?: number
        where?: Prisma.UserWhereInput
        orderBy?: Prisma.UserOrderByWithRelationInput
    }): Promise<(User & { role: Role })[]>
    create(data: Partial<User>): Promise<User & { role: Role }>
    update(id: string, data: Partial<User>): Promise<User & { role: Role }>
    delete(id: string): Promise<void>
}
