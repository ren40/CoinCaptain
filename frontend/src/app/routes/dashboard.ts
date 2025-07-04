import type { RouteRecordRaw } from 'vue-router'
import { useTransactions, useCategoryStore } from '@/entities'

export const dashboardRoute: RouteRecordRaw = {
    path: '/dashboard',
    name: 'DashboardPage',
    meta: {
        breadcrumb: {
            name: 'Доска',
        }
    },
    component: () => import('@/pages/dashboard/ui/dasboard.vue')
}


dashboardRoute.beforeEnter = async (to, from, next) => {
    const { fecthAllTransactions } = useTransactions()
    const { fetchAllCategories } = useCategoryStore()

    await fecthAllTransactions()
    await fetchAllCategories()
    next()
}