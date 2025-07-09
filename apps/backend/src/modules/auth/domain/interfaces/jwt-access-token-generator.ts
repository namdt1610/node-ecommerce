export interface IJwtAccessTokenGenerator {
    generate(userId: string): string
}
