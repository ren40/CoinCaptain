import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useAxios } from '@/shared/useAxios'

export const useCategoryStore = defineStore('category', () => {

    const categories = ref(new Map<string, {}>())
    const isLoading = ref(false)
    const { axiosInstance } = useAxios()

    const fetchAllCategories = async () => {

    }

    const createCategory = async () => {

    }
    


    return {
        categories,
        isLoading,

        fetchAllCategories,
        createCategory,
    }
})