import { IPasswordHasher } from '../../domain/interfaces/password-hasher'
import bcrypt from 'bcryptjs'

export class BcryptHasher implements IPasswordHasher {
    async hash(plain: string): Promise<string> {
        return await bcrypt.hash(plain, 12)
    }

    async verify(plain: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plain, hash)
    }
}
