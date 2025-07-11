import { Request } from 'express'

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: string
            email: string
            roleId?: string
            role?: any
            name?: string
            [key: string]: any
        }
    }
}
