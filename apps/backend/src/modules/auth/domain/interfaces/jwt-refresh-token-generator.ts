export interface IJwtRefreshTokenGenerator {
    generate(userId: string): string
}
