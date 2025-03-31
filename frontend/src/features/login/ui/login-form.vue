<template>
    <form class="wrapper">
        <input class="auth_form auth__input" placeholder="Логин" v-model="username" />
        <input class="auth_form auth__input" placeholder="Пароль" v-model="password"/>
        <a class="auth__form auth__link" href="#">Восстановить пароль/логин</a>
        <button class="auth_form auth__btn" @click="onLogin">Войти</button>
    </form>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/app/store'


const { login } = useAuthStore()
const { isAuthenticated }  = storeToRefs(useAuthStore())
const router = useRouter()
const username = ref('')
const password = ref('')

const onLogin = () => {
    login(
        {
            username: username.value,
            password: password.value
        })
        console.log(isAuthenticated.value)
        if(isAuthenticated.value) {
            router.push({
        name: 'HomePage'
    })
        }

}
</script>
<style scoped>
.auth__link {
    text-align: end;
    color: var(--white);
    text-decoration: none;
}

.auth__link:hover {
    color: var(--secondary-purple-500);
}

.wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 2rem;
}

.auth__input {
    height: 2.5rem;
    background-color: var(--black-tints-400);
    border: 1px solid;
    border-color: #474747 !important;
    color: var(--white) !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: .5rem;
    padding: 1rem;
}

.auth__btn {
    height: 2.7rem;
    background-color: var(--secondary-purple-500);
    color: var(--black-tints-500);
    border-radius: .5rem;
    cursor: pointer;
}

.auth__btn:hover {
    color: var(--white);
    cursor: pointer;
}
</style>