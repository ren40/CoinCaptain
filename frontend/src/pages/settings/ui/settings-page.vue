<template>
    <section class="settings-page">
        <h2 class="settings-page__title">Настройки</h2>
        <div class="settings-page__content">
            <p>Настройки категорий</p>
            <category-settings />
        </div>
    </section>
</template>

<script setup lang="ts">
import { CategorySettings } from '@/widgets'

</script>

<style scoped>
.settings-page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--black-tints-400);
    border-radius: .5rem;
    width: 100%;
    height: 100%;
}

.settings-page__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
}

.settings-page__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}
</style>