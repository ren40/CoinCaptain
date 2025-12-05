<template>
  <div class="budget-progress" v-if="activeBudgetStats">
    <div class="budget-info">
      <span>Бюджет: {{ formatCurrency(activeBudgetStats.budgetAmount) }}</span>
      <span>Осталось: {{ formatCurrency(activeBudgetStats.remainingAmount) }}</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-bar__fill" 
        :style="{ width: Math.min(activeBudgetStats.spentPercentage, 100) + '%' }"
        :class="{ 'progress-bar__fill--danger': activeBudgetStats.spentPercentage > 90 }"
      ></div>
    </div>
    <div class="budget-percent">{{ Math.round(activeBudgetStats.spentPercentage) }}%</div>
    <div class="budget-period">
      {{ getPeriodText(activeBudgetStats.period) }}: {{ formatDate(activeBudgetStats.startDate) }} - {{ formatDate(activeBudgetStats.endDate) }}
    </div>
  </div>
  <div class="budget-progress budget-progress--empty" v-else>
    <div class="budget-info">
      <span>Бюджет не установлен</span>
    </div>
    <div class="budget-empty-message">
      Создайте бюджет для отслеживания расходов
    </div>
    <button class="form__btn" @click="isCreateBudget = true">
                Создать бюджет
    </button>
    <v-dialog :isOpen="isCreateBudget" @close="isCreateBudget = false" :is-loading="isLoading">
                <template #header>
                    <h2>Создать новый бюджет</h2>
                </template>
                <template #main>
                    <budget-create-form @created="onBudgetCreated" />
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch, computed, ref } from 'vue';
import { useBudget, useTransactions } from '@/entities';
import { storeToRefs } from 'pinia'
import { VDialog } from '@/shared'
import { BudgetCreateForm } from '@/features'
import type { IBudgetCreate } from '@/entities'

const { fetchActiveBudgetStats, createBudget, fetchBudgets } = useBudget();
const { budgetStats, isLoading } = storeToRefs(useBudget());

// Получаем транзакции для отслеживания изменений
const { getTransactionsFromArray } = storeToRefs(useTransactions());
const isCreateBudget = ref(false)
// Проверяем, истек ли срок бюджета, и возвращаем активный бюджет или null
const activeBudgetStats = computed(() => {
  if (!budgetStats.value) {
    return null;
  }
  const now = new Date();
  const endDate = new Date(budgetStats.value.endDate);
  // Устанавливаем время на конец дня для корректного сравнения
  endDate.setHours(23, 59, 59, 999);
  // Если срок истек, возвращаем null (бюджет отключен)
  if (now > endDate) {
    return null;
  }
  return budgetStats.value;
});

const newBudget = ref({} as IBudgetCreate)

const onBudgetCreated = async () => {
    try {
        if (newBudget.value) {
            await createBudget(newBudget.value)
            isCreateBudget.value = false
            newBudget.value = {} as IBudgetCreate
            fetchBudgets()
        }
    } catch (error) {
        console.error('Error creating budget:', error)
    }
}

// Фильтруем транзакции только для текущего месяца
const currentMonthTransactions = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return getTransactionsFromArray.value.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getPeriodText = (period: string) => {
  switch (period) {
    case 'weekly':
      return 'Неделя';
    case 'monthly':
      return 'Месяц';
    case 'yearly':
      return 'Год';
    default:
      return period;
  }
};

// Отслеживаем изменения в транзакциях текущего месяца и обновляем статистику бюджета
watch(currentMonthTransactions, () => {
  if (activeBudgetStats.value) {
    fetchActiveBudgetStats();
  }
}, { deep: true });

onMounted(() => {
  fetchActiveBudgetStats();
});
</script>