import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { axios } from '@/shared'
import { checkJWT } from '@/shared'

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
            console.log(response)
            if (response.status === 200) {
                token.value = response.data.token
                 user.value = response.data.payload.username
            }
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
// export const useAuthStore = defineStore('auth', {
//     state: () => ({
//         token: null,
//         user: null,
//         isAuthenticated: () => true
//     }),
//     actions: {
//         login(user: IUser) {
//             return axios.post('/api/login', {...user}).then((response) => {
//                 if (response.status === 200) {
//                     this.token = response.data.token
//                     this.user = response.data.user
//                 }
//             })
//         },
//         login_fake(user: IUser) {
//             console.log(user.username, user.password)
//             this.token = 'fake',
//             this.user = user.username
//         },
//         logout() {
//             this.token = null
//             this.user = null
//         },
//         // isAuthenticated() {
//         //     // return checkJWT(this.token)
//         //     return true
//         // }
//     }
// })