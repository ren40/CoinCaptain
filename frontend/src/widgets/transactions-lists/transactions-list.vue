<template>
    <section class="transactions-list__section">
        <v-simple-table :headers="headers"
            :data="getTransactionsFromArray" 
            :isLoading="isLoading" 
            :page-count="pageCount" 
            :current-page="currentPage"
            @pagination="changePage"
            @selectPage="selectPage" 
            @select-items-length="selectSizeItemsView" >
            <template #item="{ items }">
                <transactions-list-item :transation="items">
                    <template #action="{ id }">
                        <transactions-delete-btn :id="id" />
                    </template>
                </transactions-list-item>
            </template>
        </v-simple-table>
        <div class="transactions-list__section--footer">
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
    </section>

</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useTransactions, type ITransactionCreate } from '@/entities/transactions'
import { onMounted, ref } from 'vue'
import { TransactionsListItem } from '@/entities'
import { VDialog, VSimpleTable } from '@/shared'
import { TransactionsCreateForm, TransactionsDeleteBtn } from '@/features'

const store = useTransactions()
const { getTransactionsFromArray, isLoading, pageCount, currentPage, sizeItemsView } = storeToRefs(store)
const { fecthAllTransactions, createItem } = store

const newTransaction = ref<ITransactionCreate>()
const isOpenDialog = ref(false)
const headers = ref([
    'Описание',
    'Сумма',
    'Дата',
    'Категория',
    'Действия'
])

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
            fecthAllTransactions()
        }
    } catch (error) {
        console.error('Error creating transaction:', error)
    }
}

const changePage = (page: number) => {
    currentPage.value += page
    fecthAllTransactions()
}

const selectPage = (page: number) => {
    currentPage.value = page
    fecthAllTransactions()
}

const selectSizeItemsView = (size: number) => {
    sizeItemsView.value = size
    fecthAllTransactions()
}
</script>
<style scoped>
.transactions-list__section {
    padding: 1.75rem;
    display: flex;
    border-radius: .5rem;
    flex-direction: column;
    overflow-y: auto;
    background-color: var(--black-tints-400);
    width: 100%;
    height: 100%;
}

.transactions-list__section--footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}
</style>