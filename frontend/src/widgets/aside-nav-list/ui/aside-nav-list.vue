<template>
    <div class="aside-nav-list__wrapper">
        <v-logo :small="isOpen" />
        <nav class="aside-nav-list">
            <ul class="aside-nav-list__list">
                <li v-for="link in navList" :key="link.namePath" class="aside-nav-list__item">
                    <router-link :to="{ name: link.namePath }" class="aside-nav-list__link"
                        :class="isActiveLink(link.namePath)">
                        <component :is="iconMap[link.icon]" class="aside-nav-list__icon" />
                        <span v-show="!isOpen">{{ link.name }}</span>
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>

</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAsideMenu } from '@/entities'
import { DashboardIcon, BudgetIcon, SettingsIcon, VLogo } from '@/shared'

const iconMap: Record<string, any> = {
    // home: HomeIcon,
    dashboard: DashboardIcon,
    budget: BudgetIcon,
    settings: SettingsIcon
}
const route = useRoute()
const currentRouteName = computed(() => route.name)

const { isOpen } = useAsideMenu()

const isActiveLink = (linkName: string) => {
    return currentRouteName.value === linkName ? 'aside-nav-list__link--active' : ''
}


const navList = [
    {
        name: 'Доска',
        namePath: 'DashboardPage',
        icon: 'dashboard'
    },
    {
        name: "Бюджет",
        namePath: 'BudgetPage',
        icon: 'budget'
    },
    {
        name: 'Настройки',
        namePath: 'SettingsPage',
        icon: 'settings'
    }
]

</script>
<style scoped>
.aside-nav-list__wrapper {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.aside-nav-list {
    padding: .5rem;
    height: calc(100vh - 4.4rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.aside-nav-list__list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

.aside-nav-list__link {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5rem;
    color: var(--white);
    text-decoration: none;
    font-size: 1rem;
    transition: all 0.3s ease;
    padding: 0.5rem .5rem;
}

.aside-nav-list__link:hover {
    border-radius: .5rem;
    background: var(--black-tints-100);
}

.aside-nav-list__link--active {
    border-radius: .5rem;
    background: var(--black-tints-100);
}

.aside-nav-list__link--active::after {
    content: '';
    position: absolute;
    left: 0;
    width: 4px;
    height: 60%;
    border-radius: .5rem;
    background-color: var(--secondary-purple-500);
}

.aside-nav-list__link:hover::after {
    content: '';
    position: absolute;
    left: 0;
    width: 4px;
    height: 60%;
    border-radius: .5rem;
    background-color: var(--secondary-purple-500);
}


.aside-nav-list__icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--white);
}
</style>