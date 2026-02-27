import type { RouteRecordRaw } from 'vue-router'
import { useBudget } from '@/entities'
import { dashboardRoute } from './dashboard'
import { settingsRoute } from './settings'
import { transactionsRoute } from './transactions'

export const mainLayoutRoute: RouteRecordRaw = {
    path: '/',
    name: 'MainLayoutPage',
    meta: {
        breadcrumb: {
            name: 'Домашняя страница',
        }
    },
    redirect: {
        name: "DashboardPage"
    },
    component: () => import('@/pages/layout/ui/layout.vue'),
    children: [
        dashboardRoute,
        settingsRoute,
        transactionsRoute,
        {
            path: '/budget',
            name: 'BudgetPage',
            meta: {
                breadcrumb: {
                    name: 'Бюджета'
                },
            },
            beforeEnter: async (to, from, next) => {
                const { fetchBudgets } = useBudget()
                await fetchBudgets()

                next()
            },
            component: () => import('@/pages/budget/ui/budget-page.vue')
        }
    ]
}