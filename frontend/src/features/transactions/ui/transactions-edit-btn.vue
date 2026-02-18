<template>
    <v-button icon class="transactions-edit-btn" aria-label="Редактировать" @click="onOpenTransaction">
        <edit-icon class="transactions-edit-btn__icon" />
    </v-button>
</template>

<script lang="ts" setup>
import { VButton } from '@/shared/ui'
import { EditIcon } from '@/shared/ui/icons'

const props = defineProps<{
    id: string,
}>()

const emit = defineEmits<{
    select: [value: string]
}>()

const onOpenTransaction = () => {
    emit('select', props.id)
}
</script>

<style scoped>
.transactions-edit-btn__icon {
    display: block;
    width: 16px;
    height: 16px;
}
</style>