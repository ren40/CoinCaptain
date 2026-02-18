<template>
    <section class="budget-edit-section">
        <form class="budget-edit-form">
            <div class="form__group">
                <label for="amount">Сумма бюджета:</label>
                <input 
                    v-model.number="editBudget.amount" 
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
                <label for="startBalance">Баланс на начало месяца:</label>
                <input 
                    v-model.number="editBudget.startBalance" 
                    class="form__input" 
                    type="number" 
                    id="startBalance" 
                    name="startBalance" 
                    min="0" 
                    step="0.01"
                />
            </div>
            
            <div class="form__group">
                <label for="period">Период:</label>
                <select 
                    v-model="editBudget.period" 
                    class="form__select" 
                    id="period" 
                    name="period"
                    required
                >
                    <option value="weekly">Неделя</option>
                    <option value="monthly">Месяц</option>
                    <option value="yearly">Год</option>
                </select>
            </div>
            
            <div class="form__group">
                <label for="startDate">Дата начала:</label>
                <input 
                    v-model="startDateInput" 
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
                    v-model="endDateInput" 
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
                    v-model="editBudget.isActive" 
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
import type { IBudget } from '@/entities'

const props = defineProps<{
    budget:  IBudget
}>()

const emit = defineEmits<{
    'update': [value: IBudget],
}>()

const editBudget = ref({
    ...props.budget,
    startBalance: props.budget.startBalance ?? 0
})
const startDateInput = ref(new Date(editBudget.value.startDate).toISOString().split('T')[0])
const endDateInput = ref(new Date(editBudget.value.endDate).toISOString().split('T')[0])
// Автоматически устанавливаем дату окончания при изменении периода или даты начала
const updateEndDate = () => {
    if (!editBudget.value.startDate || !editBudget.value.period) return
    
    const startDate = new Date(editBudget.value.startDate)
    let endDate = new Date(startDate)
    
    switch (editBudget.value.period) {
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

    endDateInput.value = endDate.toISOString().split('T')[0]
}

// Следим за изменениями периода и даты начала
watch(() => editBudget.value.period, () => {
    updateEndDate()
}, { deep: true })

watch(startDateInput, () => {
    editBudget.value.startDate = startDateInput.value
    updateEndDate()
})

watch(endDateInput, () => {
    editBudget.value.endDate = endDateInput.value
})

watch(editBudget, () => {
    emit('update', editBudget.value)
}, { deep: true })

</script>