<template>
    <v-button danger @click="onShowDialog">
        <span class="transactions-delete-btn__text"> Удалить </span>
    </v-button>
    <v-dialog :isOpen="isOpenDialog" @close="isOpenDialog = false" :is-loading="false">
        <template #header>
            <h2>Удаление категории</h2>
        </template>
        <template #main>
            <p>Вы уверены, что хотите удалить эту категорию?</p>
        </template>
        <template #footer>
            <div class="dialog-form__footer">
                <v-button @click="isOpenDialog = false">Отмена</v-button>
                <v-button danger @click="onDelete">Удалить</v-button>
            </div>
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
import { useCategoryStore } from '@/entities'
import { VDialog, VButton} from '@/shared'
import { useToast } from '@/entities'
import { ref } from 'vue'

const { deleteCategory } = useCategoryStore()
const isOpenDialog = ref(false)
const props = defineProps<{
    id: string,
}>()

const { addToast } = useToast()

const onShowDialog = () => {
    isOpenDialog.value = true
}

const onDelete = async () => {
    try {
        if (props.id) {
            await deleteCategory(props.id)
            isOpenDialog.value = false
            addToast({
                message: 'Категория удалена',
                type: 'success',
                duration: 1000
            })
        }
    } catch (error) {
        console.error('Error deleting category:', error)
        addToast({
            message: 'Ошибка удалении категории',
            type: 'error',
            duration: 1000
        })
    }
}
</script>
