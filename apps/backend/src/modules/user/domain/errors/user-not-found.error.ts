import { NotFoundError } from '@/common/errors/base.error'

export class UserNotFoundError extends NotFoundError {
    constructor(userId: string) {
        super('User', userId)
    }
}
