/**
 * Module Generator Template
 * Provides consistent structure for all modules
 */

export interface ModuleConfig {
    name: string
    entities: EntityConfig[]
    hasAuth?: boolean
    hasAdmin?: boolean
    customRoutes?: RouteConfig[]
}

export interface EntityConfig {
    name: string
    fields: FieldConfig[]
    relations?: RelationConfig[]
    validations?: ValidationConfig[]
}

export interface FieldConfig {
    name: string
    type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'array' | 'object'
    required?: boolean
    unique?: boolean
    default?: any
    enum?: string[]
}

export interface RelationConfig {
    type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany'
    target: string
    field: string
    cascade?: boolean
}

export interface ValidationConfig {
    field: string
    rules: string[]
}

export interface RouteConfig {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    path: string
    handler: string
    middleware?: string[]
    description?: string
}

/**
 * Standard module structure template
 */
export const MODULE_STRUCTURE = {
    domain: {
        entities: 'Entity definitions and value objects',
        interfaces: 'Repository and service interfaces',
        errors: 'Domain-specific error classes',
        'value-objects': 'Domain value objects',
    },
    application: {
        'use-cases': 'Business logic use cases',
        dto: 'Data transfer objects',
        validators: 'Input validation logic',
        mappers: 'Entity to DTO mapping',
    },
    infrastructure: {
        repositories: 'Data access implementations',
        'external-services': 'Third-party service integrations',
        cache: 'Caching implementations',
    },
    presentation: {
        controllers: 'HTTP request handlers',
        routes: 'Route definitions',
        middleware: 'Route-specific middleware',
    },
}

/**
 * Standard CRUD operations template
 */
export const CRUD_OPERATIONS = {
    queries: [
        'GetAllEntitiesUseCase',
        'GetEntityByIdUseCase',
        'SearchEntitiesUseCase',
    ],
    commands: [
        'CreateEntityUseCase',
        'UpdateEntityUseCase',
        'DeleteEntityUseCase',
    ],
}

/**
 * Standard DTO templates
 */
export const DTO_TEMPLATES = {
    create: 'CreateEntityDTO',
    update: 'UpdateEntityDTO',
    response: 'EntityResponseDTO',
    list: 'EntityListResponseDTO',
    filter: 'EntityFilterDTO',
}

/**
 * Standard route patterns
 */
export const ROUTE_PATTERNS = {
    list: { method: 'GET', path: '/', handler: 'getAll' },
    show: { method: 'GET', path: '/:id', handler: 'getById' },
    create: { method: 'POST', path: '/', handler: 'create' },
    update: { method: 'PUT', path: '/:id', handler: 'update' },
    patch: { method: 'PATCH', path: '/:id', handler: 'patch' },
    delete: { method: 'DELETE', path: '/:id', handler: 'delete' },
    search: { method: 'GET', path: '/search', handler: 'search' },
}

/**
 * Utility to generate module files
 */
export class ModuleTemplate {
    static generateEntityTemplate(config: EntityConfig): string {
        return `
export interface ${config.name} {
${config.fields.map((field) => `    ${field.name}${field.required ? '' : '?'}: ${field.type}`).join('\n')}
    createdAt: Date
    updatedAt: Date
}

export interface Create${config.name}Data {
${config.fields
    .filter((f) => f.name !== 'id')
    .map(
        (field) =>
            `    ${field.name}${field.required ? '' : '?'}: ${field.type}`
    )
    .join('\n')}
}

export interface Update${config.name}Data {
${config.fields
    .filter((f) => f.name !== 'id')
    .map((field) => `    ${field.name}?: ${field.type}`)
    .join('\n')}
}
`
    }

    static generateRepositoryTemplate(entityName: string): string {
        return `
import { BaseRepository } from '@/common/base/base.repository'
import { ${entityName}, Create${entityName}Data, Update${entityName}Data } from '../entities/${entityName.toLowerCase()}.entity'

export interface I${entityName}Repository extends BaseRepository<${entityName}, Create${entityName}Data, Update${entityName}Data> {
    // Add custom methods here
}
`
    }

    static generateUseCaseTemplate(
        entityName: string,
        operation: string
    ): string {
        const isQuery = ['Get', 'Search', 'Find'].some((prefix) =>
            operation.startsWith(prefix)
        )
        const baseClass = isQuery ? 'BaseQueryUseCase' : 'BaseCommandUseCase'

        return `
import { ${baseClass} } from '@/common/base/base.usecase'
import { I${entityName}Repository } from '../../domain/interfaces/${entityName.toLowerCase()}-repository.interface'

export class ${operation}${entityName}UseCase extends ${baseClass}<Input, Output> {
    constructor(private readonly repository: I${entityName}Repository) {
        super()
    }

    async execute(input: Input): Promise<Output> {
        // Implementation here
        throw new Error('Not implemented')
    }

    ${
        isQuery
            ? ''
            : `
    protected async validateBusinessRules(input: Input): Promise<void> {
        // Validation logic here
    }

    protected async performCommand(input: Input): Promise<Output> {
        // Command logic here
        throw new Error('Not implemented')
    }`
    }
}
`
    }
}
