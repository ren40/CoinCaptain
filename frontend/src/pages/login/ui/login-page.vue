<template>
  <main class="login_main">
    <section class="login_form--section">
        <main class="login_form--main">
          <login-dialog />
        </main>
    </section>
  </main>
  <footer class="login_footer">
    <p>CoinCaptain {{ getCurrentYear }}</p>
  </footer>
</template>
<script lang="ts" setup>
import { LoginDialog } from '@/widgets/login-dialog'
import { computed } from 'vue'

const getCurrentYear = computed(() => new Date().getFullYear())
</script>