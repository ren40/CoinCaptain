import { createMemoryHistory, createRouter } from 'vue-router'
import App from '@/App.vue'
import { LoginPage, NotFoundPage } from '@/pages'

const routes = [
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'BadRequestPage',
        component: NotFoundPage,
    },
    {
        path: '/',
        name: 'HomePage',
        component: App
    },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})