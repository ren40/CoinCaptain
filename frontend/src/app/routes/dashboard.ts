import type { RouteRecordRaw } from 'vue-router'
import { useTransactions } from '@/app/store'

export const dashboardRoute: RouteRecordRaw = {
    path: '/dashboard',
    name: 'DashboardPage',
    meta: {
        breadcrumb: {
            name: 'Dashboard',
        }
    },
    component: () => import('@/pages/layout/ui/layout.vue')
}


dashboardRoute.beforeEnter = async (to, from, next) => {
    const { fecthAllTransactions } = useTransactions()

    await fecthAllTransactions()
    next()
}