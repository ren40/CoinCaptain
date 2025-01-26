import { createMemoryHistory, createRouter } from 'vue-router'


const routes = [
    {
        path: '/',
        component: () => ''
    }
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})