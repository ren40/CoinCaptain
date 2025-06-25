<template>
    <form class="form__edit-category">
        <div class="form__group">
            <label for="id" class="form__label">Идентификатор</label>
            <input type="number" id="id" v-model="localCategory.id" class="form__input">
        </div>
        <div class="form__group">
            <label for="name" class="form__label">Название</label>
            <input type="text" id="name" v-model="localCategory.name" class="form__input" required>
        </div>
        <div class="form__group">
            <label for="description" class="form__label">Цвет</label>
            <!-- <input type="color" id="color" v-model="localCategory.color" class="form__input" required> -->
        </div>
    </form>
</template>

<script lang="ts" setup>
import type { ICategory } from '@/entities';
import { ref, watch } from 'vue'

const emits = defineEmits<{
    update: [category: ICategory]
}>()

const props = defineProps<{
    category: ICategory
}>()

const localCategory = ref(props.category || {})

watch(localCategory, (newVal) => {
    localCategory.value = newVal || {}
}, { deep: true })

</script>