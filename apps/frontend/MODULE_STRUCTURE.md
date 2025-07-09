# Frontend Module Structure

This document outlines the modular architecture of the frontend application.

## Directory Structure

```
src/
├── shared/                 # Shared utilities, types, and constants
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Application constants
│   ├── utils/             # Utility functions
│   └── index.ts           # Barrel exports
├── features/              # Feature-based modules
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Auth-specific components
│   │   ├── hooks/         # Auth-specific hooks
│   │   ├── providers/     # Auth context providers
│   │   ├── services/      # Auth API services
│   │   └── index.ts       # Feature exports
│   ├── products/          # Products feature
│   │   ├── components/    # Product-related components
│   │   ├── hooks/         # Product-specific hooks
│   │   ├── services/      # Product API services
│   │   └── index.ts       # Feature exports
│   ├── cart/              # Shopping cart feature
│   └── orders/            # Orders feature
├── components/            # Shared/generic components
│   ├── ui/                # Base UI components
│   ├── layout.tsx         # Main layout component
│   └── home/              # Home page components
├── hooks/                 # Shared hooks
├── lib/                   # External library configurations
└── app/                   # Next.js app directory
```

## Module Organization Principles

### 1. Feature-Based Architecture

- Each feature is self-contained in its own directory
- Features export their public API through index.ts files
- Internal implementation details are not exposed

### 2. Shared Resources

- Common types, utilities, and constants are in the `shared` module
- Reusable UI components are in the `components` directory
- Generic hooks are in the root `hooks` directory

### 3. Clear Boundaries

- Features don't directly import from other features
- Shared dependencies go through the `shared` module
- API services are co-located with their respective features

## Feature Module Structure

Each feature module follows this pattern:

```
feature-name/
├── components/            # Feature-specific React components
├── hooks/                 # Feature-specific custom hooks
├── services/              # API service functions
├── providers/             # React context providers (if needed)
├── types/                 # Feature-specific types (if needed)
└── index.ts               # Public exports
```

## Import Patterns

### Good Practices ✅

```typescript
// Import from feature modules
import { LoginForm, useAuth } from '@/features/auth'
import { ProductCard } from '@/features/products'

// Import shared utilities
import { formatPrice, ROUTES } from '@/shared'

// Import UI components
import { Button } from '@/components/ui/button'
```

### Avoid ❌

```typescript
// Don't import internal feature files directly
import { LoginForm } from '@/features/auth/components/login-form'

// Don't cross-import between features
import { useCart } from '@/features/cart'
// inside products feature - use shared state management instead
```

## Benefits

1. **Maintainability**: Each feature is self-contained and easier to modify
2. **Reusability**: Components and hooks can be easily reused
3. **Testing**: Features can be tested in isolation
4. **Team Development**: Different teams can work on different features
5. **Code Organization**: Clear separation of concerns
6. **Bundle Optimization**: Features can be code-split more effectively

## Migration Notes

- Existing components have been moved to appropriate feature modules
- Import paths have been updated to use the new structure
- Barrel exports (index.ts files) provide clean public APIs
- The auth module has been fully migrated as an example

## Next Steps

1. Complete migration of remaining features (cart, orders)
2. Add proper TypeScript interfaces for all features
3. Implement feature-specific error boundaries
4. Add comprehensive testing for each feature module
5. Consider implementing micro-frontend architecture for larger teams
