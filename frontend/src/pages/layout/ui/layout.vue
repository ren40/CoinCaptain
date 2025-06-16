<template>
    <div class="wrapper">
        <header class="layout__header">
            <header-nav />
        </header>
        <aside class="layout__nav">
            <nav>
                <ul>
                    <li><a href="/">Dashboard</a></li>
                    <li><a href="/transactions">Transactions</a></li>
                    <li><a href="/reports">Reports</a></li>
                    <li><a>Настройки</a></li>
                </ul>
            </nav>
        </aside>
        <main class="layout__main">
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
    height: calc(100vh - 4rem);
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