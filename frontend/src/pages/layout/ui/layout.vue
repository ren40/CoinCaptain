<template>
    <div class="wrapper">
        <header class="layout__header">
            <header-nav />
        </header>
        <main class="layout__main">
            <aside class="layout__nav">

            </aside>
            <div class="layout__content">
                <transactions-list />
            </div>
        </main>
        <footer class="layout__footer">

        </footer>
    </div>
</template>

<script lang="ts" setup>
import { HeaderNav } from '@/widgets'
import { TransactionsList } from '@/widgets'
</script>

<style lang="css" scoped>
.wrapper {
    display: grid;
    height: 100vh;
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "hd hd hd"
        "sd main main"
        "ft ft ft";
}

.layout__header {
    height: 4.4rem;
    grid-area: hd;
    background-color: #8ca0ff;
}

.layout__nav {
    grid-area: sd;
    background-color: rgba(17, 233, 125, 0.067);
}

.layout__main {
    max-width: 60rem;
    padding: 1.75rem;
    grid-area: main;
    background-color: #afb4d0;
}

.layout__footer {
    grid-area: ft;
    background-color: #0325e6;
}
</style>