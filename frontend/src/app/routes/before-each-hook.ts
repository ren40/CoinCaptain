import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "../store/auth"
import { storeToRefs } from 'pinia'

export const beforeEacHook = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { isAuthenticated } = storeToRefs(useAuthStore())
    if (isAuthenticated.value) {
        if (to.name === 'LoginPage') {
            next({name: 'HomePage'})
        } else {
            next()
        }
    } else {
        if (to.name === 'LoginPage' || to.name === 'RegisterPage'
        ) {
            next()
        } else {
            next({name: 'LoginPage'})
        }
    }
}