<template>
    <tr class="simple__table--row">
        <td>{{ transation.description }}</td>
        <td>{{ getAmount(transation.amount ?? 0) }}</td>
        <td>{{ getParseDate(transation.date) }}</td>
        <td>{{ getCategoryName(transation.categoryId?.toString() ?? '') }}</td>
        <td>
            <slot name="action" :id="transation.id" />
        </td>
    </tr>
</template>
<script lang="ts" setup>
import type { ITransactions } from '@/entities/transactions';
import { useCategoryStore } from '@/entities'

const { getCategoryById } = useCategoryStore()

const props = defineProps<{
    transation: ITransactions
}>()

const getParseDate = (date: string): string => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

const getCategoryName = (categoryId: string): string => {
    const category = getCategoryById(categoryId)
    return category ? category.name : 'Неизвестная категория'
}

const getAmount = (amount: number): string => {
    if (props.transation.isIncome) {
        return amount > 0 ? `+${amount}` : `${amount}`;
    } else {
        return amount < 0 ? `${amount}` : `-${amount}`;
    }
}

</script>