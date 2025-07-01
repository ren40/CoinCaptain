import { useCategoryStore, useBudget } from '@/entities'
import type { RouteRecordRaw } from 'vue-router'


export const settingsRoute: RouteRecordRaw = {
    path: '/settings',
    name: 'SettingsPage',
    meta: {
        breadcrumb: {
            name: 'Настройки',
        }
    },
    component: () => import('@/pages/settings/ui/settings-page.vue'),
    children: [
        {
            path: '/settings/category',
            name: 'CategorySettingsPage',
            meta: {
                breadcrumb: {
                    name: 'Настройки категорий',
                }
            },
            beforeEnter: async (to, from, next) => {
                const { fetchAllCategories } = useCategoryStore()
                await fetchAllCategories()
                next()
            },
            component: () => import('@/widgets/category-settings/ui/category-settings.vue')
        },
        // {
        //     path: '/settings/profile',
        //     name: 'ProfileSettingsPage',
        //     meta: {
        //         breadcrumb: {
        //             name: 'Настройки профиля',
        //         }
        //     },
        //     component: () => import('@/pages/settings/ui/profile-settings-page.vue')
        // }
    ]
}