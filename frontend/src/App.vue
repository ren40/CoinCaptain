<template>
  <error-boundary class="container">
    <RouterView />
    <footer class="app_footer">
      <p>CoinCaptain {{ getCurrentYear }}</p>
    </footer>
  </error-boundary>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/app'
import { ErrorBoundary } from '@/shared'
import { computed } from 'vue'
const { isAuthenticated } = storeToRefs(useAuthStore())

const getCurrentYear = computed(() => new Date().getFullYear())

</script>

<style>
@import url("./app/styles/style.css");

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
