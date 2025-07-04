import { createRouter, createWebHashHistory } from 'vue-router'
import { NotFoundPage, RegistrePage } from '@/pages'
import { beforeEacHook } from './before-each-hook'
import { loginRootRoute } from './login'
import { mainLayoutRoute } from './mainLayout'

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
    mainLayoutRoute,
    loginRootRoute,
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(beforeEacHook)

export default router