<template>
    <div class="toast-wrapper">
        <transition-group class="toast-wrapper__list" tag="ul" name="slide-fade">
                <li class="toast-wrapper__list--item" v-for="toast in toasts" :key="toast.id">
                    <toast-item :toast="toast" />
                </li>
        </transition-group>
    </div>
</template>
<script lang="ts" setup>
import { useToast } from '@/entities/toast'
import { storeToRefs } from 'pinia'
import { ToastItem } from '@/entities/toast'
const { toasts } = storeToRefs(useToast())
</script>
<style scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

.toast-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
}

.toast-wrapper__list {
    list-style: none;
}
</style>