<template>
  <div class="budget-progress">
    <div class="budget-info">
      <span>Бюджет: {{ budget }} ₽</span>
      <span>Осталось: {{ remaining }} ₽</span>
    </div>
    <div class="progress-bar">
      <div class="progress-bar__fill" :style="{ width: percent + '%' }"></div>
    </div>
    <div class="budget-percent">{{ percent }}%</div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps } from 'vue';

const props = defineProps<{
  budget: number;
  spent: number;
}>();

const percent = computed(() => {
  if (!props.budget) return 0;
  const p = Math.round((props.spent / props.budget) * 100);
  return p > 100 ? 100 : p < 0 ? 0 : p;
});

const remaining = computed(() => {
  return props.budget - props.spent > 0 ? props.budget - props.spent : 0;
});
</script>