<template>
    <article class="transactions-filter-form">
        <div class="transactions-filter-form__search">
            <input v-model="filterSearch" class="form__input" type="text" placeholder="Поиск по названию...">
            <button @click="onSearch" class="form__btn">Поиск</button>
        </div>

        <select v-model="slect_month" class="form__select">
            <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
            </option>
        </select>
    </article>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useTransactions } from '@/entities'

const { fecthAllTransactions, setFilter } = useTransactions()
const { filter } = storeToRefs(useTransactions())
const slect_month = ref('current')
const filterSearch = ref('')

const months = [
    {
        label: 'Текущий месяц',
        value: 'current'
    },
    {
        label: 'Все',
        value: 'all'
    }
]


const onSearch = () => {
    if (filterSearch.value.trim() !== '') {
        setFilter(`search=${filterSearch.value}&month=${slect_month.value}`)
    } else {
        setFilter(`month=${slect_month.value}`)
    }
    fecthAllTransactions()
}

watch(slect_month, (newValue) => {
    setFilter(`month=${newValue}&search=${filterSearch.value}`)
    fecthAllTransactions()
})

onMounted(() => {
    if (filter.value) {
        const month = filter.value.split('month=')[1].split('&')[0]
        slect_month.value = month
    }
})
</script>

<style scoped>
.transactions-filter-form {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: .6rem;
}

.transactions-filter-form__search {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}
</style>