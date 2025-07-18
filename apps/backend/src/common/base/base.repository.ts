/**
 * Base Repository interface for standard CRUD operations
 */
export interface BaseRepository<TEntity, TCreateInput, TUpdateInput> {
    findById(id: string): Promise<TEntity | null>
    findAll(options?: QueryOptions): Promise<TEntity[]>
    create(data: TCreateInput): Promise<TEntity>
    update(id: string, data: TUpdateInput): Promise<TEntity>
    delete(id: string): Promise<void>
    count(filters?: QueryFilters): Promise<number>
}

/**
 * Query options for repository operations
 */
export interface QueryOptions {
    pagination?: PaginationOptions
    sorting?: SortingOptions
    filters?: QueryFilters
    include?: string[]
}

export interface PaginationOptions {
    page: number
    limit: number
    offset?: number
}

export interface SortingOptions {
    field: string
    direction: 'asc' | 'desc'
}

export interface QueryFilters {
    [key: string]: any
}

/**
 * Abstract base repository implementation
 */
export abstract class AbstractBaseRepository<
    TEntity,
    TCreateInput,
    TUpdateInput,
> implements BaseRepository<TEntity, TCreateInput, TUpdateInput>
{
    abstract findById(id: string): Promise<TEntity | null>
    abstract findAll(options?: QueryOptions): Promise<TEntity[]>
    abstract create(data: TCreateInput): Promise<TEntity>
    abstract update(id: string, data: TUpdateInput): Promise<TEntity>
    abstract delete(id: string): Promise<void>
    abstract count(filters?: QueryFilters): Promise<number>

    /**
     * Build pagination query
     */
    protected buildPagination(options?: PaginationOptions) {
        if (!options) return {}

        return {
            skip: options.offset || (options.page - 1) * options.limit,
            take: options.limit,
        }
    }

    /**
     * Build sorting query
     */
    protected buildSorting(options?: SortingOptions) {
        if (!options) return {}

        return {
            orderBy: {
                [options.field]: options.direction,
            },
        }
    }
}
