<template>
  <div class="budget-progress" v-if="budgetStats">
    <div class="budget-info">
      <span>Бюджет: {{ formatCurrency(budgetStats.budgetAmount) }}</span>
      <span>Осталось: {{ formatCurrency(budgetStats.remainingAmount) }}</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-bar__fill" 
        :style="{ width: Math.min(budgetStats.spentPercentage, 100) + '%' }"
        :class="{ 'progress-bar__fill--danger': budgetStats.spentPercentage > 90 }"
      ></div>
    </div>
    <div class="budget-percent">{{ Math.round(budgetStats.spentPercentage) }}%</div>
    <div class="budget-period">
      {{ getPeriodText(budgetStats.period) }}: {{ formatDate(budgetStats.startDate) }} - {{ formatDate(budgetStats.endDate) }}
    </div>
  </div>
  <div class="budget-progress budget-progress--empty" v-else>
    <div class="budget-info">
      <span>Бюджет не установлен</span>
    </div>
    <div class="budget-empty-message">
      Создайте бюджет для отслеживания расходов
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useBudget } from '@/entities';
import { storeToRefs } from 'pinia';


const { fetchActiveBudgetStats } = useBudget();
const { budgetStats } = storeToRefs(useBudget());

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

onMounted(() => {
  fetchActiveBudgetStats();
});
</script>