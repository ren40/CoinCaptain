<template>
    <section class="transactions-page">
        <div class="transactions-container">
            <h2>Редактирование транзакции</h2>
            <template v-if="currentTransaction">
                <TransactionsEditForm :transaction="currentTransaction" @update="handleTransactionUpdate"
                    @cancel="handleEditCancel" @submit="handleEditSubmit" />
            </template>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { useTransactions } from '@/entities'
import { TransactionsEditForm } from '@/features/transactions'
import { storeToRefs } from 'pinia'
import type { ITransactions } from '@/entities'

const transactionsStore = useTransactions()
const { currentTransaction } = storeToRefs(transactionsStore)

const handleTransactionUpdate = (updatedTransaction: ITransactions) => {
  console.log('Транзакция обновлена:', updatedTransaction)
}

const handleEditCancel = () => {
  console.log('Редактирование отменено')
  transactionsStore.clearCurrentTransaction()
}

const handleEditSubmit = async (updatedTransaction: ITransactions) => {
  try {
    await transactionsStore.editItem(updatedTransaction)
    console.log('Транзакция успешно сохранена')
  } catch (error) {
    console.error('Ошибка при сохранении транзакции:', error)
  }
}
</script>

<style scoped>
.transactions-page {
    padding: 2rem;
}

.transactions-container {
    max-width: 800px;
    margin: 0 auto;
}

h1 {
    margin-bottom: 2rem;
    color: var(--white);
}

.edit-form-container {
    background: var(--black-tints-400);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
}

.edit-form-container h2 {
    margin-bottom: 1rem;
    color: var(--white);
}

.transactions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.transaction-item {
    background: var(--black-tints-200);
    padding: 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--black-tints-100);
}

.transaction-item:hover {
    border-color: var(--secondary-purple-500);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.transaction-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.transaction-description {
    font-weight: 500;
    color: var(--white);
}

.transaction-amount {
    font-weight: 600;
    font-size: 1.1rem;
}

.transaction-amount.income {
    color: var(--green-500);
}

.transaction-amount.expense {
    color: var(--danger-red);
}

.transaction-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: var(--white);
    opacity: 0.8;
}

.transaction-date,
.transaction-category {
    opacity: 0.8;
}
</style>