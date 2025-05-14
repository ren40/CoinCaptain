<template>
  <form class="wrapper" @submit.prevent="onLogin">
    <input
      class="auth_form form__input"
      placeholder="Логин"
      v-model="username"
    />
    <input
      class="auth_form form__input"
      type="password"
      placeholder="Пароль"
      v-model="password"
    />
    <div class="auth__form link__wrapper">
      <!-- <a class="auth__form form__link" href="#">Восстановить пароль</a>
      | -->
      <router-link :to="{name: 'RegisterPage'}" class="auth__form form__link" >Регистрация</router-link>  
    </div>
    <button class="auth_form form__btn" @click.prevent="onLogin">Войти</button>
  </form>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/app/store";

const { login } = useAuthStore();
const { isAuthenticated } = storeToRefs(useAuthStore());
const router = useRouter();
const username = ref("");
const password = ref("");

const onLogin = async () => {
  await login({
    username: username.value,
    password: password.value,
  })
  
  if (isAuthenticated.value) {
    router.push({
      name: "HomePage",
    });
  }
};
</script>
