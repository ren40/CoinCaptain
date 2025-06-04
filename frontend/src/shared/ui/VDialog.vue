<template>
    <Teleport to="#model">
        <Transition name="modal--fade">
            <div v-if="isOpen" class="modal__backdrop" tabindex="0">
                <div class="modal" v-click-outside="close" @keydown.esc="close">
                    <header class="modal__header">
                        <slot name="header" />
                    </header>
                    <main class="modal__main">
                        <slot name="main" />
                    </main>
                    <footer class="modal__footer">
                        <slot name="footer" />
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { VClickOutside as vClickOutside } from '@/shared'

defineProps<{
    isOpen: boolean
}>()

const emits = defineEmits<{
    (e: 'close'): void
}>()

const close = () => {
    console.log('close')
    emits('close')
}

</script>

<style scoped>
.modal--fade-enter,
.modal--fade-leave-active {
    opacity: 0;
}

.modal--fade-enter-active,
.modal--fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.modal__backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    border-radius: 0.5rem;
    background: var(--black-tints-400);
    overflow-x: auto;
    display: flex;
    flex-direction: column;
}

.modal__header,
.modal__footer {
    padding: 0.9rem;
    display: flex;
}

.modal__header {
    border-bottom: 1px solid var(--black-tints-500);
    color: var(--white);
    justify-content: space-between;
    font-size: 1.3rem;
}

.modal__footer {
    border-top: 1px solid var(--black-tints-500);
    justify-content: flex-end;
}

.modal__main {
    position: relative;
    padding: 1rem .9rem;
}
</style>