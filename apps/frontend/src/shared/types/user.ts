export interface User {
    id: string
    email: string
    name: string
    status: string
    role: { id: string; name: string }
    firstName?: string
    lastName?: string
    username?: string
    avatar?: string
    createdAt?: string
    updatedAt?: string
}
