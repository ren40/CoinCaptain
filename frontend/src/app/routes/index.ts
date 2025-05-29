import { createRouter, createWebHashHistory } from 'vue-router'
import { NotFoundPage, RegistrePage } from '@/pages'
import { beforeEacHook } from './before-each-hook'
import { loginRootRoute } from './login'
import { dashboardRoute } from './dashboard'

const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'BadRequestPage',
        component: NotFoundPage,
    },
    {
        path: '/register',
        name: 'RegisterPage',
        component: () => RegistrePage,
    },
    dashboardRoute,
    loginRootRoute,
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(beforeEacHook)

export default router