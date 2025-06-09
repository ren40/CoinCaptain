<template>
    <table>
        <thead>
            <tr>
                <th>Описание</th>
                <th>Значение</th>
                <th>Доход</th>
                <th>Дата</th>
                <th>Категория</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>
            <div v-if="isLoading" class="loading">
                <span>Загрузка...</span>
            </div>
            <div v-else-if="getTransactionsFromArray.length === 0" class="empty">
                <span>Список пуст</span>
            </div>

            <template v-else v-for="(item) in getTransactionsFromArray" :key="item.id">
                <transactions-list-item :transation="item">
                    <template #action="{ id }">
                        <transactions-delete-btn :id="id" />
                    </template>
                </transactions-list-item>
            </template>

        </tbody>
    </table>
    <div>
        <button class="form__btn " @click="openDialog">Создать</button>
        <v-dialog :isOpen="isOpenDialog" @close="isOpenDialog = false" :is-loading="isLoading">
            <template #header>
                <h2>Создание новой транзакции</h2>
            </template>
            <template #main>
                <TransactionsCreateForm :newTransaction="newTransaction" @update="onUpdate" />
            </template>
            <template #footer>
                <div class="dialog-form__footer">
                    <button class="form__btn dialog-form--btn dialog-form--btn__cancel"
                        @click="isOpenDialog = false">Закрыть</button>
                    <button class="form__btn dialog-form--btn " :disabled="!newTransaction"
                        @click="onCreateAndExit">Создать</button>
                </div>
            </template>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useTransactions, type ITransactionCreate } from '@/entities/transactions'
import { onMounted, ref } from 'vue'
import { TransactionsListItem } from '@/entities'
import { VDialog } from '@/shared'
import { TransactionsCreateForm, TransactionsDeleteBtn } from '@/features'

const store = useTransactions()
const { getTransactionsFromArray, isLoading } = storeToRefs(store)
const { fecthAllTransactions, createItem } = store

const newTransaction = ref<ITransactionCreate>()
const isOpenDialog = ref(false)

onMounted(async () => {
    if (getTransactionsFromArray.value.length === 0) {
        await fecthAllTransactions()
    }
})

const openDialog = () => {
    isOpenDialog.value = true
}

const onUpdate = (item: ITransactionCreate) => {
    newTransaction.value = { ...item }
}

const onCreateAndExit = async () => {
    try {
        if (newTransaction.value) {
            await createItem(newTransaction.value)
            isOpenDialog.value = false
            newTransaction.value = {
                description: '',
                amount: 0,
                isIncome: false,
                date: new Date().toISOString().split('T')[0],
                categoryId: 0
            }
        }
    } catch (error) {
        console.error('Error creating transaction:', error)
    }
}
</script>