import api from './client'
import { CategoryData } from '@/shared/types'

export const categoryApi = {
    getCategories: () => api.get('/categories'),
    getCategory: (id: string) => api.get(`/categories/${id}`),
    createCategory: (data: CategoryData) => api.post('/categories', data),
    updateCategory: (id: string, data: Partial<CategoryData>) =>
        api.put(`/categories/${id}`, data),
    deleteCategory: (id: string) => api.delete(`/categories/${id}`),
}
