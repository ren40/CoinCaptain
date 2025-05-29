import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useAxios } from '@/shared'
import { checkJWT, getValueFromLocalStorage, saveLocalStorage } from '@/shared'
import type { AxiosError } from 'axios'

interface IUser {
    username: string,
    password: string,
    email?: string,
}

export const useAuthStore = defineStore('auth', () => {
    const { axiosInstance } = useAxios()
    const token = ref<string | null>(null)
    const user = ref<string | null>(null)

    const isAuthenticated = computed(() => checkJWT(token.value))

    const login = (loginDate: IUser) => {
        return axiosInstance.post('/api/login', { ...loginDate }).then((response: { status: number; data: { token: string | null; payload: { username: string | null } } }) => {
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
        localStorage.removeItem('user-data')
    }

    const register = (registerDate: IUser) => {
        return axiosInstance.post('/api/user/register', { ...registerDate }).then((response: { status: number }) => {
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
        return axiosInstance.get<string>('/api/login/refresh').then((result: { status: number; data: string | null }) => {
            console.log('Refreshing token:', result.data)
            if (result.status === 200) {
                token.value = result.data
            }
        }).catch((err: AxiosError) => {
            console.error(err)
            token.value = ''
            localStorage.removeItem('user-data')
            throw new Error('Ошибка получение токена: код ошибки: ' + err.code + ' сообщение ошибки ' + err.message)
        })
    }

    onMounted(() => {
        getValueFromLocalStorage('user-data').then((result) => {
            if (result) {
                console.log('Token from localStorage:', result, !checkJWT(result))
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
        reFreshToken,
    }
})