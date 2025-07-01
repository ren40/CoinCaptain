<template>
    <button class="form__btn form__btn--danger budget-delete-btn" @click="onShowDialog">
        <span class="budget-delete-btn__text">Удалить</span>
    </button>
    <v-dialog :isOpen="isOpenDialog" @close="isOpenDialog = false" :is-loading="false">
        <template #header>
            <h2>Удаление бюджета</h2>
        </template>
        <template #main>
            <p>Вы уверены, что хотите удалить этот бюджет?</p>
            <p class="budget-delete-btn__warning">Это действие нельзя отменить.</p>
        </template>
        <template #footer>
            <div class="dialog-form__footer">
                <button class="form__btn dialog-form--btn" @click="isOpenDialog = false">Отмена</button>
                <button class="form__btn form__btn--danger dialog-form--btn" @click="onDelete" :disabled="isLoading">
                    {{ isLoading ? 'Удаление...' : 'Удалить' }}
                </button>
            </div>
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
import { useBudget } from '@/entities'
import { VDialog } from '@/shared'
import { ref } from 'vue'

const { deleteBudget, isLoading } = useBudget()
const isOpenDialog = ref(false)
const props = defineProps<{
    id: number
}>()

const emit = defineEmits<{
    deleted: []
}>()

const onShowDialog = () => {
    isOpenDialog.value = true
}

const onDelete = async () => {
    try {
        if (props.id) {
            await deleteBudget(props.id)
            isOpenDialog.value = false
            emit('deleted')
        }
    } catch (error) {
        console.error('Error deleting budget:', error)
    }
}
</script>
