import { createRouter, createWebHashHistory } from 'vue-router'
import { NotFoundPage } from '@/pages'
import { beforeEacHook } from './before-each-hook'
import { loginRootRoute } from './login'

const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'BadRequestPage',
        component: NotFoundPage,
    },
    {
        path: '/',
        name: 'HomePage',
        props: {
            msg: 'Hello World'
        },
        component: () => import('@/components/HelloWorld.vue'),
    },
    loginRootRoute,
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(beforeEacHook)

export default router