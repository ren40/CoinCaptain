import type { RouteRecordRaw } from 'vue-router'
import { LoginPage } from '@/pages/login'

export const loginRootRoute: RouteRecordRaw = {
    path: '/login',
    name: 'LoginPage',
    meta: {
        title: 'CoinCaptain | Добро пожаловать'
    },
    component: LoginPage
}
