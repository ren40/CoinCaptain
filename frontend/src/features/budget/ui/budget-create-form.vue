<template>
    <section class="budget-create-section">
        <form class="budget-create-form">
            <div class="form__group">
                <label for="amount">Сумма бюджета:</label>
                <input 
                    v-model.number="newBudget.amount" 
                    class="form__input" 
                    type="number" 
                    id="amount" 
                    name="amount" 
                    min="0" 
                    step="0.01"
                    required 
                />
            </div>
            
            <div class="form__group">
                <label for="period">Период:</label>
                <select 
                    v-model="newBudget.period" 
                    class="form__select" 
                    id="period" 
                    name="period"
                    required
                >
                    <option disabled value="">--Выберите период--</option>
                    <option value="weekly">Неделя</option>
                    <option value="monthly">Месяц</option>
                    <option value="yearly">Год</option>
                </select>
            </div>
            
            <div class="form__group">
                <label for="startDate">Дата начала:</label>
                <input 
                    v-model="newBudget.startDate" 
                    class="form__input" 
                    type="date" 
                    id="startDate" 
                    name="startDate" 
                    required 
                />
            </div>
            
            <div class="form__group">
                <label for="endDate">Дата окончания:</label>
                <input 
                    v-model="newBudget.endDate" 
                    class="form__input" 
                    type="date" 
                    id="endDate" 
                    name="endDate" 
                    required 
                />
            </div>
            
            <div class="form__group">
                <label for="isActive">Активный бюджет:</label>
                <input 
                    v-model="newBudget.isActive" 
                    class="form__input" 
                    type="checkbox" 
                    id="isActive" 
                    name="isActive" 
                />
            </div>
        </form>
    </section>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useBudget } from '@/entities'
import type { IBudgetCreate } from '@/entities'

const { isLoading } = useBudget()

const props = defineProps<{
    budget?: IBudgetCreate
}>()

const newBudget = ref<IBudgetCreate>(props.budget || {
    amount: 0,
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
})

const emit = defineEmits<{
    'update': [value: IBudgetCreate]
}>()

// Автоматически устанавливаем дату окончания при выборе периода
const updateEndDate = () => {
    if (!newBudget.value.startDate || !newBudget.value.period) return
    
    const startDate = new Date(newBudget.value.startDate)
    let endDate = new Date(startDate)
    
    switch (newBudget.value.period) {
        case 'weekly':
            endDate.setDate(startDate.getDate() + 6)
            break
        case 'monthly':
            endDate.setMonth(startDate.getMonth() + 1)
            endDate.setDate(startDate.getDate() - 1)
            break
        case 'yearly':
            endDate.setFullYear(startDate.getFullYear() + 1)
            endDate.setDate(startDate.getDate() - 1)
            break
    }
    
    newBudget.value.endDate = endDate.toISOString().split('T')[0]
}

// Следим за изменениями периода и даты начала
const watchPeriod = ref(newBudget.value.period)
const watchStartDate = ref(newBudget.value.startDate)

// Обновляем дату окончания при изменении периода или даты начала
if (watchPeriod.value !== newBudget.value.period || watchStartDate.value !== newBudget.value.startDate) {
    updateEndDate()
    watchPeriod.value = newBudget.value.period
    watchStartDate.value = newBudget.value.startDate
}


watch(newBudget, () => {
    emit('update', newBudget.value)
}, { deep: true })

</script>
