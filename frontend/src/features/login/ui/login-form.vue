<template>
  <form class="auth_form--wrapper" @submit.prevent="onLogin">
    <input id="username" class="auth_form form__input" autocomplete="username" placeholder="Логин"
      v-model.trim="username" />
   
    <v-password-input id="password" v-model="password" />
    <div class="auth__form link__wrapper">
      <!-- <a class="auth__form form__link" href="#">Восстановить пароль</a>
      | -->
      У вас нет учетной записи?
      <router-link :to="{ name: 'RegisterPage' }" class="auth__form form__link">Зарегистрироваться</router-link>
    </div>
    <button class="auth_form form__btn" @click.prevent="onLogin">Войти</button>
  </form>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/app/store";
import { useToast } from "@/entities/toast";
import { VPasswordInput } from '@/features/password-input';


const { login } = useAuthStore()
const { isAuthenticated } = storeToRefs(useAuthStore())
const router = useRouter()
const username = ref("")
const password = ref("")
const { addToast } = useToast()

const onLogin = async () => {
  await login({
    username: username.value,
    password: password.value,
  })

  if (isAuthenticated.value) {

    addToast({
      message: "Успешный вход",
      type: "success",
      duration: 3000,
    })

    router.push({
      name: "DashboardPage",
    })
  } else {
    addToast({
      message: "Неверный логин или пароль",
      type: "error",
      duration: 3000,
    })
  }
}
</script>
