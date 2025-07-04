import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAxios } from '@/shared/useAxios'
import type { ITransactions, ITransactionCreate } from './type'


export const useTransactions = defineStore('transactions', () => {
    const transactionsListsMap = ref(new Map<number, ITransactions>())
    const { axiosInstance } = useAxios()
    const isLoading = ref(false)
    const pageCount = ref(0)
    const currentPage = ref(0)
    const sizeItemsView = ref(5)

    const getTransactionsFromArray = computed(() => {
        return Array.from(transactionsListsMap.value.values())
    })

    const fecthAllTransactions = async () => {
        try {
            isLoading.value = true
            axiosInstance.get('/api/transations', {
                params: {
                    currentPage: currentPage.value || 0,
                    sizeItemsView: sizeItemsView.value || 5,
                }
            }).then((response) => {
                if (response.status === 200) {
                    console.log('Fetched transactions:', response.data)
                    transactionsListsMap.value.clear()
                    const transactions = response.data.transations as ITransactions[]
                    pageCount.value = response.data.pageCount || 0
                    currentPage.value = response.data.currentPage || 0
                    sizeItemsView.value = response.data.sizeItemsView || 5
                    transactions.forEach((transaction) => {
                        transactionsListsMap.value.set(transaction.id, transaction)
                    })
                }
            }).catch((err) => {
                console.error('Error fetching transactions:', err)
            }).finally(() => { isLoading.value = false })
        } catch (e) {
            console.error(e)
            if (e instanceof Error) {
                throw new Error(e.message)
            } else {
                throw new Error('Internal server error')
            }
        }
    }

    const createItem = async (item: ITransactionCreate) => {
        try {
            isLoading.value = true
            axiosInstance.post('/api/transations', item).then((response) => {
                if (response.status === 201) {
                    console.log('Transaction created:', response.data)
                    const newTransaction = response.data as ITransactions
                    transactionsListsMap.value.set(newTransaction.id, newTransaction)
                }
            }).catch((err) => {
                console.error('Error creating transaction:', err)
                if (err instanceof Error) {
                    throw new Error(err.message)
                } else {
                    throw new Error('Internal server error')
                }
            }).finally(() => { isLoading.value = false })
        } catch (err) {
            console.error('Error creating transaction:', err)
            if (err instanceof Error) {
                throw new Error(err.message)
            } else {
                throw new Error('Internal server error')
            }
        }
    }

    const editItem = async (key: string | string[], field: unknown) => {

    }

    const deleteItem = async (id: number) => {
        try {
            isLoading.value = true
            axiosInstance.delete(`/api/transations/${id}`).then((response) => {
                if (response.status === 200) {
                    console.log('Transaction deleted:', response.data)
                    transactionsListsMap.value.delete(Number(id))
                }
            }).catch((err) => {
                console.error('Error deleting transaction:', err)
                if (err instanceof Error) {
                    throw new Error(err.message)
                } else {
                    throw new Error('Internal server error')
                }
            }).finally(() => { isLoading.value = false })
        } catch (err) {
            console.error('Error deleting transaction:', err)
            if (err instanceof Error) {
                throw new Error(err.message)
            } else {
                throw new Error('Internal server error')
            }
        }
    }

    return {
        isLoading,
        transactionsListsMap,
        getTransactionsFromArray,
        pageCount,
        currentPage,
        sizeItemsView,
        fecthAllTransactions,
        createItem,
        editItem,
        deleteItem,
    }

})