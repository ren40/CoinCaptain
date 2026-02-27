<template>
    <div class="vbutton--wrapper">
        <div v-if="prependIcon && !isLoading" class="vbutton__icon vbutton__icon--prepend">
            <img :src="prependIcon" alt="prepend icon" />
        </div>
        <div v-if="isLoading" class="vbutton__loading">
            <div class="vbutton__spinner"></div>
        </div>
        <button 
            v-bind="buttonAttrs" 
            class="vbutton" 
            :class="buttonClasses"
            :disabled="disabled || isLoading"
            @click="handleClick"
        >
            <slot />
        </button>
        <div v-if="appendIcon && !isLoading" class="vbutton__icon vbutton__icon--append">
            <img :src="appendIcon" alt="append icon" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAttrs, ref, computed, watch } from 'vue'
import type { IDefaultPropsButton } from '../type'

// Получаем атрибуты, исключая те, которые мы обрабатываем отдельно
const attrs = useAttrs()
const { onClick, ...restAttrs } = attrs

// Определяем пропсы
const props = defineProps<IDefaultPropsButton>()

// Локальное состояние загрузки
const localLoading = ref(false)

// Вычисляемое свойство для определения состояния загрузки
const isLoading = computed(() => props.loading || localLoading.value)

// Вычисляемое свойство для классов кнопки
const buttonClasses = computed(() => ({
    'vbutton--loading': isLoading.value,
    'vbutton--disabled': props.disabled || isLoading.value,
    'vbutton--primary': props.primary,
    'vbutton--secondary': props.secondary,
    'vbutton--danger': props.danger,
    'vbutton--success': props.success,
    'vbutton--small': props.small,
    'vbutton--medium': props.medium,
    'vbutton--large': props.large,
    'vbutton--full-width': props.fullWidth,
    'vbutton--rounded': props.rounded,
    'vbutton--outline': props.outline,
    'vbutton--text': props.text,
    'vbutton--icon': props.icon,
}))

// Следим за изменением пропса loading
watch(() => props.loading, (newValue) => {
    if (newValue === false) {
        localLoading.value = false
    }
})

// Обработчик клика с правильной обработкой асинхронных функций
const handleClick = async (event: Event) => {
    // Предотвращаем клик если кнопка отключена или загружается
    if (props.disabled || isLoading.value) {
        event.preventDefault()
        return
    }

    try {
        // Устанавливаем локальное состояние загрузки
        localLoading.value = true
        
        // Если передан обработчик onClick
        if (typeof onClick === 'function') {
            await onClick(event)
        }
        
        // Эмитим событие click для родительского компонента
        emit('click', event)
        
    } catch (error) {
        console.error('Error in button click handler:', error)
        // Эмитим событие error для родительского компонента
        emit('error', error)
    } finally {
        // Сбрасываем состояние загрузки
        localLoading.value = false
    }
}

// Определяем эмиты
const emit = defineEmits<{
    click: [event: Event]
    error: [error: unknown]
}>()

// Передаем остальные атрибуты в кнопку
const buttonAttrs = computed(() => restAttrs)
</script>

<style scoped>
.vbutton--wrapper {
    display: inline-flex;
    align-items: center;
    position: relative;
}

@media screen and (max-width: 768px) {
  .vbutton   {
    width: 100%;
  }
}

.vbutton {
    appearance: none;
    -webkit-appearance: none;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem 1rem;
    border: none;
    height: 2.25rem;
    background-color: var(--black-tints-190);
    color: var(--white);
    border-radius: 0.5rem;
    cursor: pointer;
    line-height: 0;
    font-weight: 400;
    transition: all 0.2s ease;
    position: relative;
    min-width: 0.5 rem;
}

.vbutton--icon {
    padding: 0.5rem;
    min-width: 32px;
    width: 32px;
    height: 32px;
}

.vbutton:hover:not(:disabled) {
    background-color: #838bbd;
    box-shadow: 0 0 0 3px #838bbd;
    color: var(--white);
}

.vbutton:focus:not(:disabled) {
    outline: none;
    box-shadow: 0 0 0 3px #b0bafe;
    color: var(--white);
}

.vbutton:active:not(:disabled) {
    background-color: var(--secondary-purple-600);
    border-color: var(--secondary-purple-600);
    color: var(--white);
    box-shadow: 0 0 0 3px #3040a4;
}

.vbutton:disabled {
    background-color: #3040a4;
    color: var(--white);
    cursor: not-allowed;
    opacity: 0.6;
}

.vbutton:disabled:hover {
    background-color: #3040a4;
    color: var(--white);
    box-shadow: none;
}

/* Варианты кнопки */
.vbutton--primary {
    background-color: var(--secondary-purple-500);
    color: var(--black-tints-500);
}

.vbutton--secondary {
    background-color: transparent;
    color: var(--secondary-purple-500);
    border: 1px solid var(--secondary-purple-500);
}

.vbutton--secondary:hover:not(:disabled) {
    background-color: var(--secondary-purple-500);
    color: var(--white);
}

.vbutton--danger {
    background-color: var(--danger-red);
    color: var(--white);
}

.vbutton--danger:hover:not(:disabled) {
    background-color: #b02c2c;
    box-shadow: 0 0 0 3px #b02c2c;
}

.vbutton--success {
    background-color: var(--green-500);
    color: var(--green-900);
}

.vbutton--success:hover:not(:disabled) {
    background-color: #6f9c6f;
    box-shadow: 0 0 0 3px #6f9c6f;
    color: var(--white);
}

/* Размеры кнопки */
.vbutton--small {
    height: 1.75rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
}

.vbutton--large {
    height: 2.75rem;
    padding: 1rem 1.5rem;
    font-size: 1.125rem;
}

/* Состояние загрузки */
.vbutton--loading {
    cursor: not-allowed;
}

.vbutton__loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}

.vbutton__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Иконки */
.vbutton__icon {
    display: flex;
    align-items: center;
    margin: 0 0.25rem;
}

.vbutton__icon--prepend {
    margin-right: 0.5rem;
}

.vbutton__icon--append {
    margin-left: 0.5rem;
}

.vbutton__icon img {
    width: 16px;
    height: 16px;
}

/* Дополнительные стили */
.vbutton--full-width {
    width: 100%;
}

.vbutton--rounded {
    border-radius: 9999px;
}

.vbutton--outline {
    background-color: transparent;
    border: 1px solid currentColor;
}

.vbutton--outline.vbutton--primary {
    color: var(--secondary-purple-500);
    border-color: var(--secondary-purple-500);
}

.vbutton--outline.vbutton--primary:hover:not(:disabled) {
    background-color: var(--secondary-purple-500);
    color: var(--white);
}

.vbutton--outline.vbutton--danger {
    color: var(--danger-red);
    border-color: var(--danger-red);
}

.vbutton--outline.vbutton--danger:hover:not(:disabled) {
    background-color: var(--danger-red);
    color: var(--white);
}

.vbutton--outline.vbutton--success {
    color: var(--green-500);
    border-color: var(--green-500);
}

.vbutton--outline.vbutton--success:hover:not(:disabled) {
    background-color: var(--green-500);
    color: var(--white);
}
</style>