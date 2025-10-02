<template>
    <div class="category-settings">
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
                            <div class="loading-spinner"></div>
                        </div>
                    </td>
                </tr>

                <tr v-else-if="categoriesList.length === 0" class="empty">
                    <td :colspan="headers.length - 1" class="simple__table--empty">
                        <div class="empty-container">
                            <p>Список пуст</p>
                        </div>
                    </td>
                </tr>

                <template v-for="(category) in categoriesList" :key="category.id">
                    <tr class="category-settings__item">
                        <td>{{ category.name }}</td>
                        <td class="category-settings__item-actions">
                            <categories-delete-btn :id="category.id" />
                            <v-button primary @click="onOpenDialogEdit(category)">Изменить</v-button>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>


        <div class="category-settings__btn">
            <v-button primary @click="openDialog">Создать категорию</v-button>
        </div>

        <VDialog :isOpen="isOpenDialog" @close="isOpenDialog = false" :is-loading="isLoading">
            <template #header>
                <h2>Создание новой категории</h2>
            </template>
            <template #main>
                <CategoriesCreateForm :new-category="newCategory" @update="onUpdateCategory" />
            </template>
            <template #footer>
                <div class="dialog-form__footer">
                    <v-button
                        @click="isOpenDialog = false">Закрыть</v-button>
                    <v-button primary :disabled="!newCategory"
                        @click="onCreateAndExit">Создать</v-button>
                </div>
            </template>
        </VDialog>

        <VDialog :isOpen="isOpenDialogEdit" @close="isOpenDialogEdit = false" :is-loading="isLoading">
            <template #header>
                <h2>Изменение категории</h2>
            </template>
            <template #main>
                <categories-edit-form :category="categoryEdit" @update="onUpdateCategory" />
            </template>
            <template #footer>
                <div class="dialog-form__footer">
                    <v-button
                        @click="isOpenDialogEdit = false">Закрыть</v-button>
                    <v-button primary :disabled="!newCategory"
                        @click="onEditAndExit">Изменить</v-button>
                </div>

            </template>
        </VDialog>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCategoryStore, type ICategory, type ICategoryCreate } from '@/entities'
import { VDialog, VButton } from '@/shared'
import { onMounted, ref, computed, watch } from 'vue'
import { CategoriesCreateForm, CategoriesDeleteBtn, CategoriesEditForm } from '@/features'

const { isLoading, categories } = storeToRefs(useCategoryStore())
const { createCategory, editCategory, fetchAllCategories } = useCategoryStore()

const isOpenDialog = ref(false)
const newCategory = ref<ICategoryCreate>({} as ICategoryCreate)

const isOpenDialogEdit = ref(false)
const categoryEdit = ref<ICategory>({} as ICategory)

const headers = [
    'Наименование',
    'Действия'
]

const openDialog = () => {
    isOpenDialog.value = true
}

const onCreateAndExit = async () => {
    try {
        console.log(newCategory.value)
        if (newCategory.value) {
            await createCategory(newCategory.value)
            isOpenDialog.value = false
            newCategory.value = {} as ICategoryCreate
        }
    } catch (error) {
        console.error(error)
    }
}

const onEditAndExit = async () => {
    try {
        if (categoryEdit.value) {
            await editCategory(categoryEdit.value.id, categoryEdit.value)
            isOpenDialogEdit.value = false
            categoryEdit.value = {} as ICategory
        }
    } catch (error) {
        console.error(error)
    }
}

const categoriesList = computed(() => {
    return Array.from(categories.value.values())
})

const onUpdateCategory = (category: ICategoryCreate) => {
    newCategory.value = { ...category }
}


const onOpenDialogEdit = (category: ICategory) => {
    categoryEdit.value = { ...category }
    isOpenDialogEdit.value = true
}

watch(categories, () => {
    if (categoriesList.value.length === 0) {
        fetchAllCategories()
    }
})

onMounted(() => {
    if (categories.value.size === 0) {
        fetchAllCategories()
    }
})
</script>
