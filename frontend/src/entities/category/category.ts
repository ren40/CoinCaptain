import { defineStore } from 'pinia'
import { ref,computed } from 'vue'

import { useAxios } from '@/shared/useAxios'
import type { ICategory, ICategoryCreate } from './type'

export const useCategoryStore = defineStore('category', () => {
    const categories = ref(new Map<string, ICategory>())
    const isLoading = ref(false)
    const { axiosInstance } = useAxios()

    const fetchAllCategories = async () => {
        try {
            isLoading.value = true
            axiosInstance.get('/api/transations/category').then((response) => {
                if (response.status === 200) {
                    console.log('Fetched categories:', response.data)
                    categories.value.clear()
                    const categoriesData = response.data as ICategory[]
                    
                    categoriesData.forEach((category) => {
                        categories.value.set(category.id.toString(), category)
                    })
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            isLoading.value = false
        }
    }

    const getCategoryById = (categoryId: string) => {
         return categories.value.get(categoryId)
    }

    const getCategoriesFromArray = () => {
        return Array.from(categories.value.values())
    }

    const editCategory = async (categoryId: string, updatedCategory: ICategoryCreate) => {
        try {
            isLoading.value = true
            axiosInstance.put(`/api/transations/category/${categoryId}`, updatedCategory).then((response) => {
                if (response.status === 200) {
                    console.log('Updated category:', response.data)
                    categories.value.set(categoryId, response.data)
                }
            })
        } catch (e) {
            console.error(e)
            throw new Error('Failed to update category')
        } finally {
            isLoading.value = false
        }
    }

    const createCategory = async (newCategory: ICategoryCreate) => {
        try {
            isLoading.value = true
            axiosInstance.post('/api/transations/category', newCategory).then((response) => {
                if (response.status === 201) {
                    console.log('Created category:', response.data)
                    categories.value.set(response.data.id, response.data)
                }
            })
        } catch (e) {
            console.error(e)
            throw new Error('Failed to create category')

        } finally {
            isLoading.value = false
        }
    }

    const deleteCategory = async (categoryId: string) => {
        try {
            isLoading.value = true
            axiosInstance.delete(`/api/transations/category/${categoryId}`).then((response) => {
                if (response.status === 200) {
                    console.log('Deleted category:', response.data)
                    categories.value.delete(categoryId)
                }
            })
        } catch (e) {
            console.error(e)
            throw new Error('Failed to delete category')
        } finally {
            isLoading.value = false
        }
    }

    return {
        categories,
        isLoading,
        getCategoriesFromArray,

        fetchAllCategories,
        createCategory,
        deleteCategory,
        editCategory,
        getCategoryById,
    }
})