<template>
    <v-button icon class="transactions-delete-btn" danger @click.stop="onShowDialog">
        <trash-icon class="transactions-delete-btn__icon" />
    </v-button >
    <v-dialog :isOpen="isOpenDialog" @close="isOpenDialog = false" :is-loading="false">
        <template #header>
            <h2>Удаление транзакции</h2>
        </template>
        <template #main>
            <p>Вы уверены, что хотите удалить эту транзакцию?</p>
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
import { useTransactions } from '@/entities'
import { VDialog } from '@/shared'
import { TrashIcon } from '@/shared/ui/icons'
import { ref } from 'vue'
import { VButton } from '@/shared/ui'

const { deleteItem } = useTransactions()
const isOpenDialog = ref(false)
const props = defineProps<{
    id: number
}>()

const onShowDialog = () => {
    isOpenDialog.value = true
}

const onDelete = async () => {
    try {
        if (props.id) {
            await deleteItem(props.id)
        }
    } catch (error) {
        console.error('Error deleting transaction:', error)
    }
}
</script>

<style scoped>
.transactions-delete-btn__icon {
    display: block;
    width: 16px;
    height: 16px;
}
</style>