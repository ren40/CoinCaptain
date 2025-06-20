<template>
    <nav class="aside-nav-list">
        <ul class="aside-nav-list__list">
            <li v-for="link in navList" :key="link.path" class="aside-nav-list__item">
                <router-link :to="link.path">{{ link.name }}</router-link>
            </li>
        </ul>
    </nav>
</template>
<script lang="ts" setup>

const navList = [
    {
        name: 'Главная',
        path: '/',
    },
    {
        name: 'Доска',
        path: '/dashboard',
    },
    {
        name: 'Транзакции',
        path: '/transactions',
    },
    {
        name: 'Настройки',
        path: '/settings',
    }
]

</script>
<style scoped>
.aside-nav-list {
    padding: 20px;
}
.aside-nav-list__list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.aside-nav-list__item {
    margin-bottom: 10px;
}
</style>