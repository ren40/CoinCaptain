<template>
    <section class="transactions-edit-section">
        <form class="transactions-edit-form">
            <div class="form__group">
                <label for="description">Описание:</label>
                <input 
                    v-model="editItem.description" 
                    class="form__input" 
                    type="text" 
                    id="description" 
                    name="description"
                     
                />
            </div>
            
            <div class="form__group">
                <label for="amount">Сумма:</label>
                <input 
                    v-model="editItem.amount" 
                    class="form__input" 
                    type="number" 
                    id="amount" 
                    name="amount" 
                />
            </div>
            
            <div class="form__group">
                <label for="isIncome">Тип транзакции:</label>
                <div class="form__radio-group">
                    <label class="form__radio-label">
                        <input 
                            v-model="editItem.isIncome" 
                            type="radio" 
                            :value="true" 
                            name="isIncome" 
                        />
                        <span>Доход</span>
                    </label>
                    <label class="form__radio-label">
                        <input 
                            v-model="editItem.isIncome" 
                            type="radio" 
                            :value="false" 
                            name="isIncome" 
                        />
                        <span>Расход</span>
                    </label>
                </div>
            </div>
            
            <div class="form__group">
                <label for="date">Дата:</label>
                <input 
                    v-model="editItem.date" 
                    class="form__input" 
                    type="date" 
                    id="date" 
                    name="date" 
                    required 
                />
            </div>
            
            <div class="form__group">
                <label for="categoryId">Категория:</label>
                <select 
                    class="form__select" 
                    v-model="editItem.categoryId" 
                    id="categoryId" 
                    name="categoryId"
                >
                    <option disabled value="">--Пожалуйста выберите категорию--</option>
                    <option 
                        v-for="category in getCategoriesFromArray" 
                        :key="category.id" 
                        :value="category.id"
                        :style="{ color: category.color }"
                    >
                        {{ category.name }}
                    </option>
                </select>
            </div>
        </form>
    </section>
</template>

<script lang="ts" setup>
import { useCategoryStore, type ITransactions } from '@/entities';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';

const { categories } = storeToRefs(useCategoryStore());

const props = defineProps<{
    transaction: ITransactions;
}>();

const emits = defineEmits<{
    'update': [value: ITransactions];
}>();

const editItem = ref<ITransactions>({
    ...props.transaction,
    date: props.transaction.date ? new Date(props.transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
});

const getCategoriesFromArray = computed(() => {
    return Array.from(categories.value.values());
});

onMounted(() => {
    if (getCategoriesFromArray.value.length === 0) {
        useCategoryStore().fetchAllCategories();
    }
});

watch(editItem, () => {
    // Автоматически корректируем тип транзакции при изменении суммы
    if (editItem.value.amount < 0 && editItem.value.isIncome) {
        editItem.value.isIncome = false;
    }
    
    emits('update', editItem.value);
}, { deep: true });
</script>

<style scoped>
.transactions-edit-section {
    padding: 1rem;
}

.transactions-edit-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    background-color: var(--black-tints-400);
    padding: 1.5rem;
    border-radius: 0.5rem;
}

.form__group {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr;
    align-items: center;
    gap: 1rem;
}

.form__group label {
    font-weight: 500;
    color: var(--white);
}

.form__radio-group {
    display: flex;
    gap: 1rem;
}

.form__radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: var(--white);
}

.form__radio-label input[type="radio"] {
    margin: 0;
    width: 1rem;
    height: 1rem;
    accent-color: var(--secondary-purple-500);
}

.form__actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
    grid-column: 1 / -1;
}
</style>