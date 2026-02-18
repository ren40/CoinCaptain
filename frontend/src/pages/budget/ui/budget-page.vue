<template>
    <div class="budget-page">
        <div class="budget-page__header">
            <h1>Управление бюджетами</h1>
            <button class="form__btn" @click="isCreateBudget = true">
                Создать бюджет
            </button>
        </div>

        <div class="budget-page__content">
            <!-- Форма создания бюджета -->

            <v-dialog :isOpen="isCreateBudget" @close="isCreateBudget = false" :is-loading="isLoading">
                <template #header>
                    <h2>Создать новый бюджет</h2>
                </template>
                <template #main>
                    <budget-create-form v-model="newBudget" />
                </template>
                <template #footer>
                    <div class="dialog-form__footer">
                        <button class="form__btn dialog-form--btn dialog-form--btn__cancel"
                            @click="isCreateBudget = false">Закрыть</button>
                        <button class="form__btn dialog-form--btn " :disabled="!newBudget"
                            @click="onBudgetCreated">Создать</button>
                    </div>
                </template>
            </v-dialog>

            <!-- Список бюджетов -->
            <div class="budget-list" v-if="budgets.length > 0">
                <div class="budget-list__header">
                    <h2>Ваши бюджеты</h2>
                </div>
                <div class="budget-list__items">
                    <div v-for="budget in budgets" :key="budget.id" class="budget-item"
                        :class="{ 'budget-item--active': budget.isActive }">
                        <div class="budget-item__info">
                            <div class="budget-item__amount">
                                {{ formatCurrency(budget.amount) }}
                            </div>
                            <div class="budget-item__period">
                                {{ getPeriodText(budget.period) }}
                            </div>
                            <div class="budget-item__dates">
                                {{ formatDate(budget.startDate) }} - {{ formatDate(budget.endDate) }}
                            </div>
                            <div class="budget-item__start-balance" v-if="(budget.startBalance ?? 0) !== 0">
                                Баланс на начало: {{ formatCurrency(budget.startBalance ?? 0) }}
                            </div>
                        </div>

                        <div class="budget-item__actions">
                            <button v-if="!budget.isActive" class="form__btn form__btn--success"
                                @click="activateBudgetHandler(budget.id)" :disabled="isLoading">
                                Активировать
                            </button>
                            <button class="form__btn" @click="openDialog(budget)">
                                Редактировать
                            </button>
                            <budget-delete-btn :id="budget.id" @deleted="onBudgetDeleted" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Сообщение об отсутствии бюджетов -->
            <div v-else class="budget-empty">
                <h2>У вас пока нет бюджетов</h2>
                <p>Создайте первый бюджет для отслеживания расходов</p>
            </div>
        </div>

        <!-- Диалог редактирования -->
        <v-dialog :isOpen="isEditBudget" @close="isEditBudget = false" :is-loading="isLoading">
            <template #header>
                <h2>Редактировать бюджет</h2>
            </template>
            <template #main>
                <budget-edit-form v-if="editBudget" :budget="editBudget" @update="onBudgetUpdated" />
            </template>
            <template #footer>
                <div class="dialog-form__footer">
                    <button class="form__btn dialog-form--btn dialog-form--btn__cancel"
                        @click="isEditBudget = false">Закрыть</button>
                    <button class="form__btn dialog-form--btn" @click="onEditBudget">Редактировать</button>
                </div>
            </template>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useBudget } from '@/entities'
import { BudgetCreateForm, BudgetEditForm, BudgetDeleteBtn } from '@/features'
import { VDialog } from '@/shared'
import type { IBudget, IBudgetCreate, IBudgetUpdate } from '@/entities'
import { storeToRefs } from 'pinia'

const { budgets, isLoading } = storeToRefs(useBudget())
const { fetchBudgets, activateBudget, createBudget, updateBudget } = useBudget()

const emptyBudget = (): IBudgetCreate => ({
    amount: 0,
    period: 'weekly',
    startDate: '',
    endDate: '',
    isActive: false,
    startBalance: 0,
})

const newBudget = ref<IBudgetCreate>(emptyBudget())

const editBudget = ref<IBudget | null>(null)

const isCreateBudget = ref(false)
const isEditBudget = ref(false)


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

const openDialog = (budget: IBudget) => {
    editBudget.value = budget
    isEditBudget.value = true
}

const getPeriodText = (period: IBudget['period']) => {
    const mapPeriod: Record<IBudget['period'], string> = {
        'weekly': 'Неделя',
        'monthly': 'Месяц',
        'yearly': 'Год'
    }
    return mapPeriod[period]
}

const onBudgetCreated = async () => {
    try {
        if (newBudget.value) {
            await createBudget(newBudget.value)
            isCreateBudget.value = false
            newBudget.value = emptyBudget()
            fetchBudgets()
        }
    } catch (error) {
        console.error('Error creating budget:', error)
    }
}

const onBudgetUpdated = (budget: IBudget) => {
    editBudget.value = {
        ...editBudget.value,
        ...budget,
        startDate: budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : '',
        endDate: budget.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : '',
    }
}

const onEditBudget = async () => {
    try {
        if (editBudget.value) {
            await updateBudget(editBudget.value.id, editBudget.value as IBudgetUpdate)
        }

    } catch (error) {
        console.error('Error updating budget:', error)
    } finally {
        isEditBudget.value = false
        editBudget.value = null
    }
}

const onBudgetDeleted = async () => {
    await fetchBudgets()
}

const activateBudgetHandler = async (id: number) => {
    try {
        await activateBudget(id)
        fetchBudgets()
    } catch (error) {
        console.error('Error activating budget:', error)
    }
}

onMounted(() => {
    fetchBudgets()
})
</script>