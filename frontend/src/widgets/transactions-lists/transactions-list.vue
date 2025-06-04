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
            <template v-for="(item) in getTransactionsFromArray" :key="item.id"><transactions-list-item
                    :transation="item"></transactions-list-item></template>

        </tbody>
    </table>
    <div>
        <button @click="openDialog">Создать</button>
        <v-dialog :isOpen="isOpenDialog" @close="isOpenDialog = false">
            <template #header>
                <h2>Создание новой транзакции</h2>
            </template>
            <template #main>
                <TransactionsCreateForm :newTransaction="newTransaction" />
            </template>
            <template #footer>
                <div class="transactions-create-form__footer">
                    <button class="form__btn transactions-create-form--btn transactions-create-form--btn__cancel"
                        @click="isOpenDialog = false">Закрыть</button>
                    <button class="form__btn transactions-create-form--btn " :disabled="!newTransaction"
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
import { TransactionsCreateForm } from '@/features'

const store = useTransactions()
const { getTransactionsFromArray } = storeToRefs(store)
const { fecthAllTransactions, createItem } = store

const newTransaction = ref<ITransactionCreate>()
const isOpenDialog = ref(false)

onMounted(() => {
    if (getTransactionsFromArray.value.length === 0) {
        fecthAllTransactions()
    }
})

const openDialog = () => {
    isOpenDialog.value = true
}

const onCreateAndExit = () => {
    if (newTransaction.value) {
        createItem(newTransaction.value)
        isOpenDialog.value = false
    }
}
</script>