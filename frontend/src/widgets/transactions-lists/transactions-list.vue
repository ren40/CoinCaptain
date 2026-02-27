<template>
    <section class="transactions-list__section">
        <header class="transactions-list__section--header">
            <transactions-filter-form />
        </header>
        <main>
            <v-simple-table
            :headers="headers"
            :data="getTransactionsFromArray"
            :isLoading="isLoading"
            :page-count="pageCount"
            :current-page="currentPage"
            @pagination="changePage"
            @selectPage="selectPage"
            @select-items-length="selectSizeItemsView">
                <template #item="{ items }">
                    <transactions-list-item :transation="items">
                        <template #action="{ id }">
                            <div class="transactions-list__section--btn">
                                <transactions-edit-btn :id="String(id)" @select="onSelect" />
                                <transactions-delete-btn :id="id" />
                            </div>
                        </template>
                    </transactions-list-item>
                </template>
            </v-simple-table>
            <v-dialog :is-open="isEditDialogOpen" @close="isEditDialogOpen = false" :is-loading="isLoading">
                <template #header>
                    <h2>Редактирование транзакции</h2>
                </template>
                <template #main>
                    <transactions-edit-form
                        :transaction="selectedTransaction as ITransactions"
                        @update="onUpdateEditTransaction"
                    />
                </template>
                <template #footer>
                    <div class="dialog-form__footer">
                        <button
                            class="form__btn dialog-form--btn dialog-form--btn__cancel"
                            @click="isEditDialogOpen = false"
                        >
                            Закрыть
                        </button>
                        <button class="form__btn dialog-form--btn "
                            @click="onEditAndExit">Сохранить</button>
                    </div>
                </template>
            </v-dialog>
        </main>

        <footer class="transactions-list__section--footer">
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
        </footer>
    </section>

</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useTransactions, type ITransactionCreate, type ITransactions } from '@/entities/transactions'
import { onMounted, ref } from 'vue'
import { TransactionsListItem } from '@/entities'
import { VDialog, VSimpleTable } from '@/shared'
import { TransactionsCreateForm, TransactionsEditForm, TransactionsDeleteBtn, TransactionsFilterForm, TransactionsEditBtn } from '@/features'

const store = useTransactions()
const { getTransactionsFromArray, isLoading, pageCount, currentPage, sizeItemsView } = storeToRefs(store)
const { fecthAllTransactions, createItem, editItem } = store

const emptyTransaction = (): ITransactionCreate => ({
    description: '',
    amount: 0,
    isIncome: false,
    date: new Date().toISOString().split('T')[0],
    categoryId: 0,
})

const newTransaction = ref<ITransactionCreate>()
const selectedTransaction = ref<ITransactions | null>(null)
const editTransaction = ref<ITransactions | null>(null)

const isOpenDialog = ref(false)
const isEditDialogOpen = ref(false)

const headers = ref([
    'Наименование',
    'Сумма',
    'Дата',
    'Категория',
    'Действия'
])

const fetchTransactions = async () => {
    await fecthAllTransactions()
}

onMounted(async () => {
    if (getTransactionsFromArray.value.length === 0) {
        await fetchTransactions()
    }
})

const onSelect = (id: string) => {
    selectedTransaction.value = getTransactionsFromArray.value.find(item => item.id === Number(id)) ?? null
    isEditDialogOpen.value = true
}

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
            newTransaction.value = emptyTransaction()
        }

        await fetchTransactions()
    } catch (error) {
        console.error('Error creating transaction:', error)
    }
}

const onUpdateEditTransaction = (item: ITransactions) => {
    editTransaction.value = item
}

const onEditAndExit = async () => {
    try {
        if (editTransaction.value) {
            await editItem(editTransaction.value)
            isEditDialogOpen.value = false
        }
    } catch (error) {
        console.error('Error edit transaction:', error)
    } finally {
        editTransaction.value = null
    }
}

const changePage = (page: number) => {
    currentPage.value += page
    fetchTransactions()
}

const selectPage = (page: number) => {
    currentPage.value = page
    fetchTransactions()
}

const selectSizeItemsView = (size: number) => {
    sizeItemsView.value = size
    fetchTransactions()
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

.transactions-list__section--header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.transactions-list__section--footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.transactions-list__section--btn {
    display: flex;
    gap: 1rem;
    align-items: center;
}
</style>