<template>
  <form class="wrapper" @submit.prevent="onLogin">
    <input
      class="auth_form auth__input"
      placeholder="Логин"
      v-model="username"
    />
    <input
      class="auth_form auth__input"
      type="password"
      placeholder="Пароль"
      v-model="password"
    />
    <a class="auth__form auth__link" href="#">Восстановить пароль/логин</a>
    <button class="auth_form auth__btn" @click.prevent="onLogin">Войти</button>
  </form>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
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
