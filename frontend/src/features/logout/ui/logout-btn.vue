<template>
    <button @click="onLogout">Выход</button>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/app/store'
import { useRouter } from 'vue-router'

const { logout } = useAuthStore()
const router = useRouter()


const onLogout = () => {
    logout()
    router.push({name: 'LoginPage'})
}
</script>