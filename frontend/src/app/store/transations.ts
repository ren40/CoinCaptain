import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAxios } from '@/shared/useAxios'
export interface ITransactions {
    id: number,
    date: string,
    description: string,
    amount: number,
    categoryId: number,
    isIncome: boolean,
    balance: number,
    createdAt: string,
}

export const useTransactions = defineStore('transactions', () => {
    const transactionsListsMap = ref(new Map<number, ITransactions>())
    const { axiosInstance } = useAxios()
    const isLoading = ref(false)
    const fecthAllTransactions = async () => {
        try {
            isLoading.value = true
            axiosInstance.get('/api/transations').then((response) => {
                if (response.status === 200) {
                    console.log('Fetched transactions:', response.data)
                    transactionsListsMap.value.clear()
                    const transactions = response.data.transations as ITransactions[]
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

    const fetchOneTransaction = async (transactionId: string) => {

    }

    return {
        isLoading,
        transactionsListsMap,
        fecthAllTransactions,
        fetchOneTransaction,
    }

})