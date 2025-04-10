import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { axios } from '@/shared'
import { checkJWT } from '@/shared'
import type { AxiosError } from 'axios'

interface IUser {
    username: string,
    password: string
}
export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const user = ref<string | null>(null)

    const isAuthenticated = computed(() => checkJWT(token.value))

    const login = (loginDate: IUser) => {
        return axios.post('/api/login', { ...loginDate }).then((response) => {
            if (response.status === 200) {
                token.value = response.data.token
                user.value = response.data.payload.username
            }
        }).catch((err: AxiosError) => {
            console.error(err)
            throw new Error('Ошибка авторизации: код ошибки: ' + err.code + ' сообщение ошибки ' + err.message)
        })
    }

    const logout = () => {
        token.value = null
    }

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
    }
})