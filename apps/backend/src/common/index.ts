// Base Classes
export * from './base/base.usecase'
export * from './base/base.repository'
export * from './base/base.dto'
export * from './base/base.controller'
export * from './base/base.container'

// Error Classes
export * from './errors/base.error'

// Shared Types
export * from './types/shared.types'

// Utilities
export * from './utils/route.utils'
export * from './utils/validation.utils'
export * from './utils/format.utils'
export * from './utils/database.utils'

// Factories
export * from './factories/seed-data.factory'

// Configuration
export * from './config/config.manager'

// Templates (with explicit exports to avoid conflicts)
export {
    ModuleConfig,
    EntityConfig,
    FieldConfig,
    RelationConfig,
    ValidationConfig,
    ModuleTemplate,
    MODULE_STRUCTURE,
    CRUD_OPERATIONS,
    DTO_TEMPLATES,
    ROUTE_PATTERNS,
} from './templates/module.template'
