<template>
    <router-link :to="{ name: 'MainLayoutPage' }" class="v-logo-container" :class="{ 'v-logo-container--small': small }">
        <img src="/logo.svg" alt="Logo" class="v-logo-img" />
        <p v-show="!small" class="v-logo-text">CoinCaptain</p>
    </router-link>
</template>

<script lang="ts" setup>

const { small } = defineProps<{
    small?: boolean
}>()


</script>

<style scoped>
.v-logo-container {
    display: flex;
    align-items: center;
    padding: .5rem;
    gap: 0.5rem;
    height: 4.4rem;
    color: var(--white);
    text-decoration: none;
}

.v-logo-container--small {
    height: 3.5rem;
}

.v-logo-img {
    height: 100%;
    width: auto;
    max-width: 100%;
}
</style>