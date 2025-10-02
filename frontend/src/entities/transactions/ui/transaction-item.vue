<template>
    <section class="transaction-view">
        <header>
            <h2>Транзакция</h2>
        </header>
        <main>
            <slot name="main" :transaction="transaction"></slot>
        </main>
        <footer>
            <slot name="edit" @edit="editItem" @delete="deleteItem(transaction.id)"></slot>
        </footer>
    </section>
</template>

<script lang="ts" setup>
import { type ITransactions, useTransactions } from '@/entities/transactions'

const { deleteItem, editItem } = useTransactions()

defineProps<{
    transaction: ITransactions
}>()
</script>