<template>
  <header class="login_header">
    <nav class="login_nav">
      <div class="login_nav--icon"></div>
      <div>
        <ul class="login__nav--list">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      </div>
      <div>

      </div>
    </nav>
  </header>
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
<style scoped>
.login__nav--list {
  list-style: none;
}
.login_form--section {
  margin-top: 8rem;
  height: 25rem;
  width: 42rem;
  border-radius: 2rem;
}

.login_main {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}

.login_form--main {
  margin: 2px;
}

.login_nav {
  display: flex;
  justify-content: space-around;
}

.login_header {
  height: 40px;
}

.login_footer {
  height: 4rem;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  padding: .5rem;
  color: #6C6C6C;
}
</style>