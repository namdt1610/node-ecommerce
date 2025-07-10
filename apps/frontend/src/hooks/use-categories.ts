import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '@/lib/api/categories'

// Category hooks
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryApi.getCategories(),
        select: (data) => data.data,
    })
}
