import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "../store/auth"

export const beforeEacHook = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { isAuthenticated } = useAuthStore()

    if (isAuthenticated()) {
        if (to.name === 'LoginPage') {
            next({name: 'HomePage'})
        } else {
            next()
        }
    } else {
        if (to.name === 'LoginPage') {
            next()
        } else {
            next({name: 'LoginPage'})
        }
    }
}