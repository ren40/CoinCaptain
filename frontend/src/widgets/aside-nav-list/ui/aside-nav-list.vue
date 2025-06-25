<template>
    <nav class="aside-nav-list">
        <ul class="aside-nav-list__list">
            <li v-for="link in navList" :key="link.namePath" class="aside-nav-list__item">
                <router-link :to="{ name: link.namePath }">{{ link.name }}</router-link>
            </li>
        </ul>
    </nav>
</template>
<script lang="ts" setup>

const navList = [
    {
        name: 'Главная',
        namePath: 'MainLayoutPage',
    },
    {
        name: 'Доска',
        namePath: 'DashboardPage',
    },
    {
        name: 'Настройки',
        namePath: 'SettingsPage',
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