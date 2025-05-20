<template>
    <section class="register__wrapper">
        <h2 class="login__header">Регистрация</h2>
        <form @submit="onSubmit" class="register__form">
            <input class="auth__form form__input" type="text" placeholder="Имя пользователя" required
                v-model="username" />
            <input class="form__input" type="email" placeholder="Почта" required v-model.trim="email" />
            <input class="form__input" type="password" placeholder="Пароль" required v-model.trim="password" />
            <input class="form__input" type="password" placeholder="Повтори пароль" required v-model.trim="passwordConfirm" />
        </form>
        <div class="register_btn">
            <button :disabled="!isValidate" type="submit" @click="onSubmit"
                class="auth__form form__btn register__btn">Зарегестрироваться</button>
        </div>
        <div class="register_link">
            <p>Уже существует аккаунт?</p>
            <router-link to="/login" class="form__link">Авторизоваться</router-link>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/app'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const { register } = useAuthStore()
const router = useRouter()


const isValidate = computed(() => {
    return isValidUsername() && isValidPassword() && isValidEmail()
})

const isValidUsername = () => {
    if (username.value && username.value !== '') {
        return true
    }
    return false
}

const isValidPassword = () => {
    if (password.value && passwordConfirm.value && (password.value === passwordConfirm.value)) {
        return true
    }
    return false
}

const isValidEmail = () => {
    if (email.value) {
        return true
    }
    return false
}

const onSubmit = () => {
    if (isValidate.value) {
        register({
            username: username.value,
            email: email.value,
            password: password.value
        }).then(() => {
            router.push({
                name: 'LoginPage'
            })
        })
    }
}
</script>