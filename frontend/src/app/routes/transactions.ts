import type { RouteRecordRaw } from 'vue-router'
import { useTransactions } from '@/entities'

export const transactionsRoute: RouteRecordRaw = {
    path: '/transactions/:id',
    name: 'TransactionsPage',
    meta: {
        breadcrumb: {
            name: 'Транзакции',
        }
    },
    component: () => import('@/pages/transactions/ui/transactions.vue'),
    beforeEnter: async (to, from, next) => {
        const { fetchTransactionById } = useTransactions()
        await fetchTransactionById(parseInt(to.params.id as string))
        next()
    }
}