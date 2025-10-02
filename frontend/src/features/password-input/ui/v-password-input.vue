<template>
    <div class="password-wrapper">
        <input id="password" class="auth_form form__input input__password" autocomplete="current-password"
            :type="showPassword ? 'text' : 'password'" placeholder="Пароль" v-model.trim="modelValue" />
        <button type="button" class="password-toggle" @click="togglePassword">
            <EyeIcon v-if="!showPassword" />
            <EyeOffIcon v-else />
        </button>
    </div>
</template>

<script lang="ts" setup>
import { EyeIcon, EyeOffIcon } from "@/shared/ui/icons";
import { ref } from "vue"

const showPassword = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const modelValue = defineModel<string>('modelValue')

</script>
<style scoped>
.password-wrapper {
    position: relative;
    width: 100%;
}

.password-toggle {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.input__password {
    width: 100%;
}
</style>