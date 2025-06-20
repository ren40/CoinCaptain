import type { RouteRecordRaw } from 'vue-router'
import { dashboardRoute } from './dashboard'

export const mainLayoutRoute: RouteRecordRaw = {
    path: '/',
    name: 'MainLayout',
    meta: {
        breadcrumb: {
            name: 'Домашняя страница',
        }
    },
    component: () => import('@/pages/layout/ui/layout.vue'),
    children: [
        dashboardRoute,
    ]
}