<template>
    <tr class="simple__table--row">
        <td>{{ transation.description }}</td>
        <td>{{ getAmount(transation.amount) }}</td>
        <td>{{ getParseDate(transation.date) }}</td>
        <td>{{ transation.categoryId }}</td>
        <td>
            <slot name="action" :id="transation.id" />
        </td>
    </tr>
</template>
<script lang="ts" setup>
import type { ITransactions } from '@/entities/transactions';

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

const getAmount = (amount: number): string => {
    return amount > 0 && props.transation.isIncome ? `+${amount}` : `-${amount}`;
}
</script>