type Factory<T> = () => T

export class BaseContainer {
    private registry = new Map<string, unknown | Factory<unknown>>()
    private singletons = new Map<string, unknown>()

    register<T>(name: string, instance: T): void {
        this.registry.set(name, instance)
    }

    registerLazy<T>(name: string, factory: Factory<T>): void {
        this.registry.set(name, factory)
    }

    resolve<T>(name: string): T {
        const item = this.registry.get(name)

        if (!item) {
            throw new Error(`[DI] '${name}' not registered.`)
        }

        if (typeof item === 'function') {
            if (!this.singletons.has(name)) {
                const instance = (item as Factory<T>)()
                this.singletons.set(name, instance)
            }
            return this.singletons.get(name) as T
        }

        return item as T
    }

    resolveClass<T>(ClassDef: new (...args: any[]) => T): T {
        const paramNames = this.getConstructorParamNames(ClassDef)
        const deps = paramNames.map((name) => this.resolve(name))
        return new ClassDef(...deps)
    }

    private getConstructorParamNames(fn: Function): string[] {
        const fnStr = fn.toString()
        const match = fnStr.match(/constructor\s*\(([^)]*)\)/)
        if (!match) return []
        return match[1]
            .split(',')
            .map((param) => param.trim())
            .filter(Boolean)
    }
}
