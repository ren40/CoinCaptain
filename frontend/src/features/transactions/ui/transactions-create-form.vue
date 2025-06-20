<template>
    <section class="transactions-create-section">
        <form class="transactions-create-form">
            <div class="form__group">
                <label for="description">Описание:</label>
                <input v-model="newItem.description" class="form__input" type="text" id="description" name="description"
                    required />
            </div>
            <div class="form__group">
                <label for="amount">Сумма:</label>
                <input v-model="newItem.amount" class="form__input" type="number" id="amount" name="amount" required />
            </div>
            <div class="form__group">
                <label for="isIncome">Доход:</label>
                <input v-model="newItem.isIncome" class="form__input" type="checkbox" id="isIncome" name="isIncome" />
            </div>
            <div class="form__group">
                <label for="date">Дата:</label>
                <input v-model="newItem.date" class="form__input" type="date" id="date" name="date" required />
            </div>
            <div class="form__group">
                <label for="categoryId">Категория:</label>
                <select class="form__select" v-model="newItem.categoryId" id="categoryId" name="categoryId">
                    <option value="">--Пожалуйста выберите категорию--</option>
                    <!-- Здесь будут опции категорий -->
                </select>
            </div>
        </form>
    </section>
</template>

<script lang="ts" setup>
import type { ITransactionCreate } from '@/entities';
import { ref, watch } from 'vue';

const props = defineProps<{
    newTransaction?: ITransactionCreate
}>()

const emits = defineEmits<{
    'update': [value: ITransactionCreate],
}>()

const newItem = ref(props.newTransaction || {
    description: '',
    amount: 0,
    isIncome: false,
    date: new Date().toISOString().split('T')[0], // Текущая дата в формате YYYY-MM-DD
    categoryId: 0
});

watch(newItem, () => {
    if (newItem.value.amount < 0 && newItem.value.isIncome) {
        newItem.value.isIncome = false
    }
    emits('update', newItem.value)
}, { deep: true })
</script>