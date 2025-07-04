<template>
    <form class="form__category-create">
        <div class="form__group">
            <label for="categoryName">Название категории</label>
            <input id="categoryName" name="categoryName" required class="form__input" type="text" v-model="newCategory.name" placeholder="Введите название категории" />
        </div>

        <div class="form__group">
            <label for="categoryColor">Цвет категории</label>
            <!-- <input id="categoryColor" name="categoryColor" required class="form__input" type="color" v-model="categoryColor" /> -->
        </div>
    </form>
</template>

<script setup lang="ts">
import type { ICategoryCreate } from '@/entities';
import { ref, watch } from 'vue'

const props = defineProps<{
    newCategory?: ICategoryCreate
}>()

const newCategory = ref(props.newCategory || {
    name: '',
    color: '#000000'
})

const emits = defineEmits<{
    'update': [value: ICategoryCreate]
}>()


watch(newCategory, () => {
    emits('update', newCategory.value)
}, { deep: true })
</script>