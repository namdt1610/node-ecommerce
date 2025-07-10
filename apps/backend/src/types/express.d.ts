declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                email: string
                roleId: string
                [key: string]: any
            }
        }
    }
}

export {}
