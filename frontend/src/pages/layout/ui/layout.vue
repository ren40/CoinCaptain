<template>
    <div class="wrapper" :class="{ 'wrapper--open': !isOpen }">
        <header class="layout__header">
            <header-nav />
        </header>
        <aside class="layout__nav" :class="{ 'layout__nav--open': !isOpen }">
            <aside-nav-list />
        </aside>
        <main class="layout__main">
            <div class="layout__content">
               <router-view />
            </div>
        </main>
        <footer class="layout__footer">
        </footer>
    </div>
</template>

<script lang="ts" setup>
import { HeaderNav, AsideNavList } from '@/widgets'
import { RouterView } from 'vue-router'
import { useAsideMenu } from '@/entities'
const { isOpen } = useAsideMenu()

</script>

<style lang="css" scoped>
.wrapper {
    display: grid;
    height: calc(100vh - 4rem);
    grid-template-columns: 60px auto auto;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "sd hd hd"
        "sd main main"
        "sd ft ft";
}

.wrapper--open {
    grid-template-columns: 200px auto auto;
}

.layout__header {
    height: 4.4rem;
    grid-area: hd;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.layout__nav {
    grid-area: sd;
    width: 60px;
    transition: width 0.3s ease;
}

.layout__nav--open {
    width: 200px;
}


.layout__main {
    overflow: hidden;
    overflow-y: auto;
    /* max-width: 60rem; */
    padding: 1.75rem;
    grid-area: main;
}

.layout__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.layout__footer {
    grid-area: ft;
    background-color: #0325e6;
}
</style>