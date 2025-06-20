<template>
    <div class="not-found-page">
        <h1>404</h1>
        <p>Страница не найдена</p>
        <router-link to="/">На главную страницу</router-link>
    </div>
</template>
<style scoped>
.not-found-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 4rem);
}
</style>