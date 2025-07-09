import { ProductType } from '../../../product/domain/entities/product.entity'

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    icon?: string
    image?: string
    parentId?: string
    parent?: Category
    children?: Category[]
    level: number
    path: string // e.g., "electronics/smartphones/premium"
    productTypes: ProductType[]
    attributes: CategoryAttribute[]
    specifications: CategorySpecification[]
    metadata: CategoryMetadata
    seo: CategorySEO
    displayOrder: number
    isActive: boolean
    isVisible: boolean
    isFeatured: boolean
    createdAt: Date
    updatedAt: Date
}

export interface CategoryAttribute {
    id: string
    name: string
    type: AttributeType
    isRequired: boolean
    isFilterable: boolean
    isVariant: boolean
    options?: AttributeOption[]
    validation?: AttributeValidation
    displayOrder: number
    group?: string
}

export enum AttributeType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    SELECT = 'SELECT',
    MULTI_SELECT = 'MULTI_SELECT',
    COLOR = 'COLOR',
    SIZE = 'SIZE',
    BOOLEAN = 'BOOLEAN',
    RANGE = 'RANGE',
    DATE = 'DATE',
}

export interface AttributeOption {
    value: string
    label: string
    color?: string
    image?: string
    isDefault?: boolean
    displayOrder: number
}

export interface AttributeValidation {
    min?: number
    max?: number
    pattern?: string
    required?: boolean
    customValidator?: string
}

export interface CategorySpecification {
    id: string
    name: string
    description?: string
    group: string
    dataType: 'string' | 'number' | 'boolean' | 'array'
    unit?: string
    isRequired: boolean
    displayOrder: number
    validation?: SpecificationValidation
}

export interface SpecificationValidation {
    min?: number
    max?: number
    allowedValues?: string[]
    pattern?: string
}

export interface CategoryMetadata {
    productCount?: number
    averagePrice?: number
    priceRange?: {
        min: number
        max: number
    }
    topBrands?: string[]
    popularFilters?: string[]
    seasonality?: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' | 'ALL_YEAR'
    targetAudience?: string[]
}

export interface CategorySEO {
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    canonicalUrl?: string
    structuredData?: Record<string, any>
    breadcrumbs?: BreadcrumbItem[]
}

export interface BreadcrumbItem {
    name: string
    url: string
    position: number
}

// Pre-defined category templates for different product types
export interface CategoryTemplate {
    productType: ProductType
    name: string
    description: string
    requiredAttributes: Omit<CategoryAttribute, 'id'>[]
    optionalAttributes: Omit<CategoryAttribute, 'id'>[]
    specifications: Omit<CategorySpecification, 'id'>[]
    metadata: Partial<CategoryMetadata>
}

// Category hierarchy and navigation
export interface CategoryHierarchy {
    root: Category[]
    levels: CategoryLevel[]
    maxDepth: number
}

export interface CategoryLevel {
    level: number
    categories: Category[]
}

export interface CategoryNavigation {
    megaMenu: CategoryMegaMenu[]
    sidebar: CategorySidebar[]
    breadcrumbs: BreadcrumbItem[]
    filters: CategoryFilter[]
}

export interface CategoryMegaMenu {
    category: Category
    featured: boolean
    columns: CategoryColumn[]
    promotions?: CategoryPromotion[]
}

export interface CategoryColumn {
    title: string
    categories: Category[]
    showImages: boolean
}

export interface CategoryPromotion {
    title: string
    description: string
    image: string
    url: string
    type: 'BANNER' | 'PRODUCT' | 'COLLECTION'
}

export interface CategorySidebar {
    category: Category
    showProductCount: boolean
    showSubcategories: boolean
    maxSubcategories: number
}

export interface CategoryFilter {
    attribute: CategoryAttribute
    values: FilterValue[]
    type: 'CHECKBOX' | 'RADIO' | 'RANGE' | 'COLOR' | 'SIZE'
}

export interface FilterValue {
    value: string
    label: string
    count: number
    color?: string
    image?: string
}

// CRUD operations
export interface CreateCategoryData {
    name: string
    slug?: string
    description?: string
    icon?: string
    image?: string
    parentId?: string
    productTypes: ProductType[]
    attributes?: Omit<CategoryAttribute, 'id'>[]
    specifications?: Omit<CategorySpecification, 'id'>[]
    displayOrder?: number
    isActive?: boolean
    isVisible?: boolean
    isFeatured?: boolean
    seo?: CategorySEO
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CategoryFilters {
    parentId?: string
    level?: number
    productType?: ProductType[]
    isActive?: boolean
    isVisible?: boolean
    isFeatured?: boolean
    search?: string
}

export interface CategorySearchOptions {
    query?: string
    filters?: CategoryFilters
    includeChildren?: boolean
    includeProducts?: boolean
    sortBy?: 'name' | 'displayOrder' | 'productCount' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Analytics and insights
export interface CategoryAnalytics {
    productCount: number
    totalRevenue: number
    averageOrderValue: number
    conversionRate: number
    topProducts: TopProduct[]
    popularFilters: PopularFilter[]
    seasonalTrends: SeasonalTrend[]
    userEngagement: UserEngagement
}

export interface TopProduct {
    productId: string
    name: string
    sales: number
    revenue: number
    views: number
}

export interface PopularFilter {
    attribute: string
    value: string
    usage: number
    conversionRate: number
}

export interface SeasonalTrend {
    month: number
    sales: number
    revenue: number
    averagePrice: number
}

export interface UserEngagement {
    averageTimeOnCategory: number
    bounceRate: number
    pagesPerSession: number
    returnVisitorRate: number
}

// Pre-defined category templates
export const CATEGORY_TEMPLATES: CategoryTemplate[] = [
    {
        productType: ProductType.SMARTPHONE,
        name: 'Smartphones',
        description: 'Mobile phones and smartphones from various brands',
        requiredAttributes: [
            {
                name: 'Brand',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: false,
                displayOrder: 1,
                group: 'Basic',
            },
            {
                name: 'Storage',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: true,
                displayOrder: 2,
                group: 'Technical',
                options: [
                    { value: '64GB', label: '64GB', displayOrder: 1 },
                    { value: '128GB', label: '128GB', displayOrder: 2 },
                    { value: '256GB', label: '256GB', displayOrder: 3 },
                    { value: '512GB', label: '512GB', displayOrder: 4 },
                    { value: '1TB', label: '1TB', displayOrder: 5 },
                ],
            },
            {
                name: 'Color',
                type: AttributeType.COLOR,
                isRequired: true,
                isFilterable: true,
                isVariant: true,
                displayOrder: 3,
                group: 'Appearance',
            },
        ],
        optionalAttributes: [
            {
                name: 'Network',
                type: AttributeType.MULTI_SELECT,
                isRequired: false,
                isFilterable: true,
                isVariant: false,
                displayOrder: 4,
                group: 'Technical',
                options: [
                    { value: '5G', label: '5G', displayOrder: 1 },
                    { value: '4G', label: '4G LTE', displayOrder: 2 },
                    { value: '3G', label: '3G', displayOrder: 3 },
                ],
            },
            {
                name: 'Screen Size',
                type: AttributeType.RANGE,
                isRequired: false,
                isFilterable: true,
                isVariant: false,
                displayOrder: 5,
                group: 'Display',
                validation: { min: 4, max: 8 },
            },
        ],
        specifications: [
            {
                name: 'Display Size',
                description: 'Screen diagonal size in inches',
                group: 'Display',
                dataType: 'string',
                unit: 'inch',
                isRequired: true,
                displayOrder: 1,
            },
            {
                name: 'Resolution',
                description: 'Screen resolution in pixels',
                group: 'Display',
                dataType: 'string',
                isRequired: true,
                displayOrder: 2,
            },
            {
                name: 'Processor',
                description: 'Main processor/chipset',
                group: 'Performance',
                dataType: 'string',
                isRequired: true,
                displayOrder: 3,
            },
            {
                name: 'RAM',
                description: 'System memory',
                group: 'Performance',
                dataType: 'string',
                unit: 'GB',
                isRequired: true,
                displayOrder: 4,
            },
            {
                name: 'Battery Capacity',
                description: 'Battery capacity',
                group: 'Battery',
                dataType: 'string',
                unit: 'mAh',
                isRequired: false,
                displayOrder: 5,
            },
        ],
        metadata: {
            seasonality: 'ALL_YEAR',
            targetAudience: [
                'tech-enthusiasts',
                'general-consumers',
                'business-users',
            ],
        },
    },
    {
        productType: ProductType.LAPTOP,
        name: 'Laptops',
        description: 'Portable computers and laptops',
        requiredAttributes: [
            {
                name: 'Brand',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: false,
                displayOrder: 1,
                group: 'Basic',
            },
            {
                name: 'Processor',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: false,
                displayOrder: 2,
                group: 'Performance',
            },
            {
                name: 'RAM',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: true,
                displayOrder: 3,
                group: 'Performance',
            },
            {
                name: 'Storage',
                type: AttributeType.SELECT,
                isRequired: true,
                isFilterable: true,
                isVariant: true,
                displayOrder: 4,
                group: 'Storage',
            },
        ],
        optionalAttributes: [
            {
                name: 'Graphics Card',
                type: AttributeType.SELECT,
                isRequired: false,
                isFilterable: true,
                isVariant: false,
                displayOrder: 5,
                group: 'Performance',
            },
            {
                name: 'Screen Size',
                type: AttributeType.SELECT,
                isRequired: false,
                isFilterable: true,
                isVariant: false,
                displayOrder: 6,
                group: 'Display',
                options: [
                    { value: '13', label: '13 inch', displayOrder: 1 },
                    { value: '14', label: '14 inch', displayOrder: 2 },
                    { value: '15', label: '15 inch', displayOrder: 3 },
                    { value: '16', label: '16 inch', displayOrder: 4 },
                    { value: '17', label: '17 inch', displayOrder: 5 },
                ],
            },
        ],
        specifications: [
            {
                name: 'Display',
                description: 'Screen specifications',
                group: 'Display',
                dataType: 'string',
                isRequired: true,
                displayOrder: 1,
            },
            {
                name: 'Processor Details',
                description: 'Detailed processor information',
                group: 'Performance',
                dataType: 'string',
                isRequired: true,
                displayOrder: 2,
            },
            {
                name: 'Battery Life',
                description: 'Expected battery life',
                group: 'Battery',
                dataType: 'string',
                unit: 'hours',
                isRequired: false,
                displayOrder: 3,
            },
        ],
        metadata: {
            seasonality: 'ALL_YEAR',
            targetAudience: [
                'students',
                'professionals',
                'gamers',
                'content-creators',
            ],
        },
    },
]
