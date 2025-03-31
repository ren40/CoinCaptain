<template>
    <div class="wrapper_login">
        <h2 class="login__header">Авторизация</h2>
        <login-form></login-form>
    </div>
</template>
<script lang="ts" setup>
import { LoginForm } from '@/features/login'
</script>
<style>
.wrapper_login {
    border-radius: .5rem;
    background-color: var(--black-tints-400);
    padding: 108px 145px;
}

.login__header {
    font-weight: 600;
    font-size: x-large;
    letter-spacing: 2px;
    text-align: center;
    color: var(--white);
}
</style>