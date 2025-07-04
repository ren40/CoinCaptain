<template>
    <button class="form__btn form__btn--danger" @click="onShowDialog">
        <span class="transactions-delete-btn__text"> Удалить </span>
    </button>
    <v-dialog :isOpen="isOpenDialog" @close="isOpenDialog = false" :is-loading="false">
        <template #header>
            <h2>Удаление категории</h2>
        </template>
        <template #main>
            <p>Вы уверены, что хотите удалить эту категорию?</p>
        </template>
        <template #footer>
            <div class="dialog-form__footer">
                <button class="form__btn dialog-form--btn" @click="isOpenDialog = false">Отмена</button>
                <button class="form__btn form__btn--danger dialog-form--btn " @click="onDelete">Удалить</button>
            </div>
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
import { useCategoryStore } from '@/entities'
import { VDialog } from '@/shared'
import { ref } from 'vue'

const { deleteCategory } = useCategoryStore()
const isOpenDialog = ref(false)
const props = defineProps<{
    id: string,
}>()

const onShowDialog = () => {
    isOpenDialog.value = true
}

const onDelete = async () => {
    try {
        if (props.id) {
            await deleteCategory(props.id)
            isOpenDialog.value = false
        }
    } catch (error) {
        console.error('Error deleting category:', error)
    }
}
</script>
