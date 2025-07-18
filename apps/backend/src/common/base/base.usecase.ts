/**
 * Base Use Case abstract class
 * Provides consistent structure for all use cases
 */
export abstract class BaseUseCase<TInput = any, TOutput = any> {
    /**
     * Execute the use case
     */
    abstract execute(input: TInput): Promise<TOutput>

    /**
     * Validate input before execution
     */
    protected validateInput(input: TInput): void {
        if (input === null || input === undefined) {
            throw new Error('Input cannot be null or undefined')
        }
    }

    /**
     * Execute with validation
     */
    async executeWithValidation(input: TInput): Promise<TOutput> {
        this.validateInput(input)
        return this.execute(input)
    }
}

/**
 * Base Query Use Case for read operations
 */
export abstract class BaseQueryUseCase<TInput, TOutput> extends BaseUseCase<
    TInput,
    TOutput
> {
    protected readonly cacheEnabled: boolean = false

    constructor(cacheEnabled: boolean = false) {
        super()
        this.cacheEnabled = cacheEnabled
    }
}

/**
 * Base Command Use Case for write operations
 */
export abstract class BaseCommandUseCase<TInput, TOutput> extends BaseUseCase<
    TInput,
    TOutput
> {
    /**
     * Validate business rules before execution
     */
    protected abstract validateBusinessRules(input: TInput): Promise<void>

    async execute(input: TInput): Promise<TOutput> {
        await this.validateBusinessRules(input)
        return this.performCommand(input)
    }

    protected abstract performCommand(input: TInput): Promise<TOutput>
}
