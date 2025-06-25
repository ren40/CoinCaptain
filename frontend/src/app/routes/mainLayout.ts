import type { RouteRecordRaw } from 'vue-router'
import { dashboardRoute } from './dashboard'
import { settingsRoute } from './settings'

export const mainLayoutRoute: RouteRecordRaw = {
    path: '/',
    name: 'MainLayoutPage',
    meta: {
        breadcrumb: {
            name: 'Домашняя страница',
        }
    },
    component: () => import('@/pages/layout/ui/layout.vue'),
    children: [
        dashboardRoute,
        settingsRoute
    ]
}