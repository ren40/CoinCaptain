import { createRouter, createWebHistory } from 'vue-router'
import { NotFoundPage, RegistrePage } from '@/pages'
import { beforeEacHook } from './before-each-hook'
import { loginRootRoute } from './login'
import { mainLayoutRoute } from './mainLayout'

const routes = [
    {
        path: '/register',
        name: 'RegisterPage',
        component: RegistrePage,
    },
    mainLayoutRoute,
    loginRootRoute,
    {
        path: '/:pathMatch(.*)*',
        name: 'BadRequestPage',
        component: NotFoundPage,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(beforeEacHook)

export default router