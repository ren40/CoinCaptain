import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { axios } from '@/shared'
import { checkJWT, getValueFromLocalStorage, saveLocalStorage } from '@/shared'
import type { AxiosError } from 'axios'

interface IUser {
    username: string,
    password: string,
    email?: string,
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
                saveLocalStorage('user-data', token.value)
            }
        }).catch((err: AxiosError) => {
            console.error(err)
            throw new Error('Ошибка авторизации: код ошибки: ' + err.code + ' сообщение ошибки ' + err.message)
        })
    }

    const logout = () => {
        token.value = null
    }

    const register = (registerDate: IUser) => {
        return axios.post('/api/user/register', { ...registerDate }).then((response) => {
            console.log({ ...registerDate })
            if (response.status === 200) {
                return true
            }
        }).catch((err: AxiosError) => {
            console.error(err)
            throw new Error('Ошибка авторизации: код ошибки: ' + err.code + ' сообщение ошибки ' + err.message)
        })
    }

    const reFreshToken = () => {
        return axios.get<string>('/api/login/refresh').then((result) => {
            if(result.status === 200) {
                token.value = result.data
            }
        }).catch((err: AxiosError) => {
            console.error(err)
            throw new Error('Ошибка получение токена: код ошибки: ' + err.code + ' сообщение ошибки ' + err.message)
        })
    }

    onMounted(() => {
        getValueFromLocalStorage('user-data').then((result) => {
            if (result) {
                if (!checkJWT(result)) {
                    reFreshToken()
                } else {
                    token.value = result
                }
            }
        }).catch((e) => {
            console.error(e)
        })
    })

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
        register,
    }
})