import { PrismaClient } from '@prisma/client'

/**
 * Base Container interface for dependency injection
 */
export interface IBaseContainer {
    resolve<T>(key: string): T
    register<T>(key: string, instance: T): void
    registerLazy<T>(key: string, factory: () => T): void
    has(key: string): boolean
}

/**
 * Base Container implementation with lazy loading support
 * This eliminates duplicate container patterns across modules
 */
export abstract class BaseContainer implements IBaseContainer {
    private instances = new Map<string, any>()
    private factories = new Map<string, () => any>()
    protected prisma: PrismaClient

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || new PrismaClient()
        this.registerCoreDependencies()
    }

    /**
     * Register core dependencies that all containers need
     */
    private registerCoreDependencies(): void {
        this.register('prisma', this.prisma)
    }

    /**
     * Resolve a dependency
     */
    resolve<T>(key: string): T {
        // Check if instance already exists
        if (this.instances.has(key)) {
            return this.instances.get(key)
        }

        // Check if factory exists
        if (this.factories.has(key)) {
            const factory = this.factories.get(key)!
            const instance = factory()
            this.instances.set(key, instance)
            return instance
        }

        throw new Error(`Dependency '${key}' not found in container`)
    }

    /**
     * Register a singleton instance
     */
    register<T>(key: string, instance: T): void {
        this.instances.set(key, instance)
    }

    /**
     * Register a lazy-loaded factory function
     */
    registerLazy<T>(key: string, factory: () => T): void {
        this.factories.set(key, factory)
    }

    /**
     * Check if a dependency exists
     */
    has(key: string): boolean {
        return this.instances.has(key) || this.factories.has(key)
    }

    /**
     * Clear all dependencies (useful for testing)
     */
    clear(): void {
        this.instances.clear()
        this.factories.clear()
        this.registerCoreDependencies()
    }

    /**
     * Get all registered keys
     */
    getRegisteredKeys(): string[] {
        return [
            ...Array.from(this.instances.keys()),
            ...Array.from(this.factories.keys()),
        ]
    }
}

/**
 * Container factory helper
 */
export abstract class ContainerFactory {
    protected abstract createContainer(): BaseContainer

    /**
     * Create and configure container
     */
    public create(): BaseContainer {
        const container = this.createContainer()
        this.configureDependencies(container)
        return container
    }

    /**
     * Override this method to configure module-specific dependencies
     */
    protected abstract configureDependencies(container: BaseContainer): void
}
