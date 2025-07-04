import { ref } from 'vue'
import { useAxios } from '@/shared'
import type { IBudget, IBudgetCreate, IBudgetUpdate, IBudgetStats } from './type'
import { defineStore } from 'pinia'

const { axiosInstance } = useAxios()

export const useBudget = defineStore('budget', () => {
    const budgets = ref<IBudget[]>([])
    const activeBudget = ref<IBudget | null>(null)
    const budgetStats = ref<IBudgetStats | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Получение всех бюджетов пользователя
    const fetchBudgets = async () => {
        isLoading.value = true
        error.value = null
        try {
            const response = await axiosInstance.get('/api/budget')
            budgets.value = response.data.budgets
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Ошибка при получении бюджетов'
            console.error('Error fetching budgets:', err)
        } finally {
            isLoading.value = false
        }
    }

    // Получение активного бюджета
    const fetchActiveBudget = async () => {
        isLoading.value = true
        error.value = null
        try {
            const response = await axiosInstance.get('/api/budget/active')
            activeBudget.value = response.data.budget
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Ошибка при получении активного бюджета'
            console.error('Error fetching active budget:', err)
        } finally {
            isLoading.value = false
        }
    }

    // Получение конкретного бюджета по ID
    const fetchBudgetById = async (id: number) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await axiosInstance.get(`/api/budget/${id}`)
            return response.data.budget
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Ошибка при получении бюджета'
            console.error('Error fetching budget:', err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    // Создание нового бюджета
    const createBudget = async (budgetData: IBudgetCreate) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await axiosInstance.post('/api/budget', budgetData)
            const newBudget = response.data
            budgets.value.unshift(newBudget)
            if (newBudget.isActive) {
                activeBudget.value = newBudget
            }
            return newBudget
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Ошибка при создании бюджета'
            console.error('Error creating budget:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Обновление бюджета
    const updateBudget = async (id: number, budgetData: IBudgetUpdate) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await axiosInstance.put(`/api/budget/${id}`, budgetData)
            const updatedBudget = response.data
            
            // Обновляем в списке бюджетов
            const index = budgets.value.findIndex(b => b.id === id)
            if (index !== -1) {
                budgets.value[index] = updatedBudget
            }
            
            // Обновляем активный бюджет если это он
            if (activeBudget.value?.id === id) {
                activeBudget.value = updatedBudget
            }
            
            return updatedBudget
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Ошибка при обновлении бюджета'
            console.error('Error updating budget:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Удаление бюджета
    const deleteBudget = async (id: number) => {
        isLoading.value = true
        error.value = null
        try {
            await axiosInstance.delete(`/api/budget/${id}`)
            
            // Удаляем из списка бюджетов
            budgets.value = budgets.value.filter(b => b.id !== id)
            
            // Очищаем активный бюджет если это он
            if (activeBudget.value?.id === id) {
                activeBudget.value = null
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Ошибка при удалении бюджета'
            console.error('Error deleting budget:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Получение статистики бюджета
    const fetchBudgetStats = async (id: number) => {
        isLoading.value = true
        error.value = null
        try {
            const response = await axiosInstance.get(`/api/budget/${id}/stats`)
            return response.data.stats
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Ошибка при получении статистики бюджета'
            console.error('Error fetching budget stats:', err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    // Получение статистики активного бюджета
    const fetchActiveBudgetStats = async () => {
        isLoading.value = true
        error.value = null
        try {
            const response = await axiosInstance.get('/api/budget/active/stats')
            budgetStats.value = response.data.stats
            return response.data.stats
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Ошибка при получении статистики активного бюджета'
            console.error('Error fetching active budget stats:', err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    // Активация бюджета (деактивирует все остальные)
    const activateBudget = async (id: number) => {
        return await updateBudget(id, { isActive: true })
    }

    // Деактивация бюджета
    const deactivateBudget = async (id: number) => {
        return await updateBudget(id, { isActive: false })
    }

    return {
        budgets,
        activeBudget,
        budgetStats,
        isLoading,
        error,

        fetchBudgets,
        fetchActiveBudget,
        fetchBudgetById,
        createBudget,
        updateBudget,
        deleteBudget,
        fetchBudgetStats,
        fetchActiveBudgetStats,
        activateBudget,
        deactivateBudget,
    }
})
