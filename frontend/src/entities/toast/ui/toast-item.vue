<template>
    <section class="toast-item" :class="lineColorClass">
        <main class="toast-item__content">
            <p class="toast-item__message">{{ toast.message }}</p>
            <div class="toast-item__close" v-if="toast.close || true">
                <v-button class="toast-item__close-btn" small text @click="handleRemove">
                    X
                </v-button>
            </div>
        </main>
    </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { IToastItemProps } from '../type'
import { useToast } from '../toast'
import { VButton } from '@/shared/ui'

const { toast } = defineProps<IToastItemProps>()

const { removeToast } = useToast()

const lineColorClass = computed(() => `line--${toast.type}`)

const handleRemove = (): void => {
    removeToast(toast.id)
}
</script>
<style scoped>
.toast-item {
    position: relative;
    display: flex;

    min-height: 4rem;
    min-width: 24rem;

    overflow: hidden;
    background-color: var(--black-tints-400);

    border-radius: 0.5rem;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
}

.toast-item__content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;

    padding: 1rem;

    width: 100%;
}

.toast-item__message {
    margin: 0;
    line-height: 1.4;
}

.line--success::after {
    content: '';
    position: absolute;

    right: 0;

    width: .4rem;
    height: 100%;

    background-color: var(--green-500);
}

.line--success::before {
    content: '';
    position: absolute;

    left: 0;

    width: .4rem;
    height: 100%;

    background-color: var(--green-500);
}

.line--error::after {
    content: '';
    position: absolute;

    right: 0;

    width: .4rem;
    height: 100%;

    background-color: var(--danger-red);
}

.line--error::before {
    content: '';
    position: absolute;

    left: 0;

    width: .4rem;
    height: 100%;

    background-color: var(--danger-red);
}

.line--warning::before {
    content: '';
    position: absolute;

    left: 0;

    width: .4rem;
    height: 100%;

    background-color: var(--yellow-900);
}

.line--warning::after {
    content: '';
    position: absolute;

    right: 0;

    width: .4rem;
    height: 100%;

    background-color: var(--yellow-900);
}

.line--info::before {
    content: '';
    position: absolute;

    left: 0;

    width: .4rem;
    height: 100%;
    background-color: var(--blue-900);
}

.line--info::after {
    content: '';
    position: absolute;

    right: 0;

    width: .4rem;
    height: 100%;
    background-color: var(--blue-900);
}
</style>