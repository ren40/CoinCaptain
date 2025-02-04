import { defineStore } from 'pinia'
import axios from 'axios'
import { checkJWT } from '@/shared'

interface IUser {
    username: string,
    password: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null,
    }),
    actions: {
        login(user: IUser) {
            return axios.post('/api/login', {...user}).then((response) => {
                if (response.status === 200) {
                    this.token = response.data.token
                    this.user = response.data.user
                }
            })
        },
        logout() {
            this.token = null
            this.user = null
        },
        isAuthenticated() {
            return checkJWT(this.token)
        }
    }
})