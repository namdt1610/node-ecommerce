import { UnitOfWork } from '@/repositories/unitOfWork'

export async function uowWrapper<T>(
    callback: (uow: UnitOfWork) => Promise<T>
): Promise<T> {
    const uow = new UnitOfWork()
    await uow.start()

    try {
        const result = await callback(uow)
        await uow.commit()
        return result
    } catch (error) {
        await uow.rollback()
        throw error
    }
}
