<template>
    <Teleport to="#model">
        <Transition name="modal--fade">
            <div v-if="isOpen" class="modal__backdrop" tabindex="0">
                <div v-if="isLoading" class="modal__loading">
                    <span>Loading...</span>
                </div>
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
    isOpen: boolean,
    isLoading?: boolean,
}>()

const emits = defineEmits<{
    (e: 'close'): void
}>()

const close = () => {
    console.log('close')
    emits('close')
}

</script>