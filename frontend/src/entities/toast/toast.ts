import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IToast, createIToast } from './type'

export const useToast = defineStore('toast', () => {
    const toasts = ref<IToast[]>([])
    const timers = ref<Map<number, number>>(new Map())

    const addToast = (toast: createIToast) => {
        const id = Date.now() + Math.random() // Более уникальный ID
        const newToast: IToast = {
            ...toast, 
            id,
            autoRemove: toast.autoRemove !== false // По умолчанию true
        }
        
        toasts.value.push(newToast)

        // Если autoRemove включен, устанавливаем таймер
        if (newToast.autoRemove) {
            const timer = setTimeout(() => {
                removeToast(id)
            }, newToast.duration)
            
            timers.value.set(id, timer)
        }
    }

    const removeToast = (id: number) => {
        // Очищаем таймер если он существует
        const timer = timers.value.get(id)
        if (timer) {
            clearTimeout(timer)
            timers.value.delete(id)
        }
        
        toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }

    const clearToasts = () => {
        // Очищаем все таймеры
        timers.value.forEach(timer => clearTimeout(timer))
        timers.value.clear()
        toasts.value = []
    }

    return { toasts, addToast, removeToast, clearToasts }
})