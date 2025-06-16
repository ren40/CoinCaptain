<template>
    <table class="simple__table">
        <thead>
            <tr class="simple__table--header">
                <th v-for="header in headers" :key="header">{{ header }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="isLoading">
                <td :colspan="headers.length - 1" class="simple__table--loading">
                    <div class="loading-container">
                        <div class="loading-spinner">
                        </div>
                    </div>
                </td>
            </tr>

            <tr v-else-if="data.length === 0" class="empty">
                <td :colspan="headers.length - 1" class="simple__table--empty">
                    <div class="empty-container">
                        <p>Список пуст</p>
                    </div>
                </td>
            </tr>
            <template v-else v-for="(item, indx) in props.data" :key="indx">
                <slot :name="'item'" :items="item" :index="indx" />
            </template>
        </tbody>
        <tfoot>
            <tr class="footer__container">
                <slot name="footer" :items="data" />
                <div class="pagination__container">

                    <select class="form__select pagination__select"
                        @input="(e) => emits('selectItemsLength', Number((e.target as HTMLSelectElement).value || ''))">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <!-- TODO надо сделать по красивее, например сделать ограничение по кол-ву кнопок, исправить кнопок -->
                    <div class="pagination">
                        <button :disabled="pageNumber - 1 < 0" @click="() => emits('pagination', -1)">
                            Назад
                        </button>
                        <template v-for="page in (pageCount)" :key="page">
                            <button @click="() => emits('selectPage', page - 1)">
                                {{ page - 1 }}
                            </button>
                        </template>
                        <button :disabled="pageNumber >= (pageCount - 1)" @click="() => emits('pagination', 1)">
                            Дальше
                        </button>
                    </div>
                </div>
            </tr>
        </tfoot>
    </table>
</template>
<script lang="ts" setup generic="T">
import { ref } from 'vue'

const props = defineProps<{
    headers: string[]
    data: T[]
    pageCount: number
    isLoading: boolean
}>()

const emits = defineEmits<{
    pagination: [page: number],
    selectItemsLength: [count: number],
    selectPage: [page: number],
    sortByDirection: [direction: 'asc' | 'desc']
}>()

const pageNumber = ref(0)

</script>
<style scoped>
.pagination__container {
    grid-column: 8 / 9;
    display: flex;
    width: 100%;
    justify-content: end;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>