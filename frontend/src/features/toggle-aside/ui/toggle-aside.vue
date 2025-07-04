<template>
    <button class="toggle-aside" @click="onToggle">
        <a-side-icon class="toggle-aside__icon " :class="isOpen ? 'toggle-aside__icon--active': '' " />
    </button>
</template>

<script lang="ts" setup>
import { ASideIcon } from '@/shared'
import { useAsideMenu } from '@/entities'

const { toggleAsideMenu, isOpen } = useAsideMenu()

const onToggle = () => {
    toggleAsideMenu()
}
</script>

<style scoped>
.toggle-aside {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background-color: var(--black-tints-500);
    border: none;
    cursor: pointer;
}

.toggle-aside__icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--white);
}

.toggle-aside__icon:hover {
    color: var(--secondary-purple-500);
}
.toggle-aside__icon--active {
    color: var(--secondary-purple-300);
}
</style>