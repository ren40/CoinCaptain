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
                <td :colspan="headers.length" class="simple__table--empty">
                    <div class="empty-container">
                        <p>Список пуст</p>
                    </div>
                </td>
            </tr>
            <template v-else v-for="(item, indx) in props.data" :key="indx">
                <slot :name="'item'" :items="item" :index="indx" />
            </template>
        </tbody>
    </table>
    <div class="simple__table--footer__container">
        <slot name="footer" :items="data" />
        <div class="pagination__container">
            <select class="form__select pagination__select"
                @input="selectItemsLength">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
            <!-- TODO надо сделать по красивее, например сделать ограничение по кол-ву кнопок, исправить кнопок -->
            <div class="pagination">
                <button class="form__btn" :disabled="currentPage - 1 < 0" @click="() => emits('pagination', -1)">
                    Назад
                </button>
                <template v-for="page in (pageCount)" :key="page">
                    <button class="form__btn " :class="isActiveBtn(page - 1)"
                        @click="() => emits('selectPage', page - 1)">
                        {{ page - 1 }}
                    </button>
                </template>
                <button class="form__btn" :disabled="(props.currentPage + 1) >= (props.pageCount)" @click="() => emits('pagination', 1)">
                    Дальше
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup generic="T">
// TODO надо сделать плавный переход 
const props = defineProps<{
    headers: string[]
    data: T[]
    pageCount: number
    currentPage: number
    isLoading: boolean
}>()

const emits = defineEmits<{
    pagination: [page: number],
    selectItemsLength: [count: number],
    selectPage: [page: number],
    sortByDirection: [direction: 'asc' | 'desc']
}>()

const selectItemsLength = (e: Event) => {
    emits('selectItemsLength', Number((e.target as HTMLSelectElement).value || ''))
    emits('selectPage', 0)
}

const isActiveBtn = (page: number) => {
    console.log(props.pageCount, props.currentPage, (props.currentPage + 1) >= (props.pageCount))
    return page === props.currentPage ? 'form__btn--active' : ''
}

</script>
<style scoped>
.pagination__container {
    grid-column: 8 / 9;
    display: flex;
    gap: 1rem;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.pagination {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>