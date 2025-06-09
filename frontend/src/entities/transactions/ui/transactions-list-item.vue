<template>
    <tr>
        <td>{{ transation.description }}</td>
        <td>{{ transation.amount }}</td>
        <td>{{ transation.isIncome }}</td>
        <td>{{ transation.date }}</td>
        <td>{{ transation.categoryId }}</td>
        <td>
            <slot name="action" :id="transation.id" />
        </td>
    </tr>
</template>
<script lang="ts" setup>
import type { ITransactions } from '@/entities/transactions';

defineProps<{
    transation: ITransactions
}>()
</script>