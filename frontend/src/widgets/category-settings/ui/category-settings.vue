<template>
    <div class="category-settings">
        <ul class="category-settings__list">
            <li v-if="categoriesList.length === 0" class="category-settings__item">
                <p>Категорий нет</p>
            </li>
            <li v-for="category in categoriesList" :key="category.id" class="category-settings__item">
                <div class="category-settings__item-content">
                    <p>{{ category.name }}</p>
                    <div class="category-settings__item-actions">
                        <categories-delete-btn :id="category.id" />
                        <button class="form__btn" @click="onOpenDialogEdit(category)">Изменить</button>
                    </div>
                </div>
            </li>
        </ul>

        <div class="category-settings__btn">
            <button class="form__btn" @click="openDialog">Создать категорию</button>
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
                    <button class="form__btn dialog-form--btn dialog-form--btn__cancel"
                        @click="isOpenDialog = false">Закрыть</button>
                    <button class="form__btn dialog-form--btn " :disabled="!newCategory"
                        @click="onCreateAndExit">Создать</button>
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
                <button class="form__btn dialog-form--btn dialog-form--btn__cancel"
                    @click="isOpenDialogEdit = false">Закрыть</button>
                <button class="form__btn dialog-form--btn " :disabled="!newCategory"
                    @click="onEditAndExit">Изменить</button>
            </template>
        </VDialog>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCategoryStore, type ICategory, type ICategoryCreate } from '@/entities'
import { VDialog } from '@/shared'
import { onMounted, ref, computed } from 'vue'
import { CategoriesCreateForm, CategoriesDeleteBtn, CategoriesEditForm } from '@/features'

const { isLoading, categories } = storeToRefs(useCategoryStore())
const { createCategory, editCategory, fetchAllCategories } = useCategoryStore()

const isOpenDialog = ref(false)
const newCategory = ref<ICategoryCreate>({} as ICategoryCreate)

const isOpenDialogEdit = ref(false)
const categoryEdit = ref<ICategory>({} as ICategory)

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

onMounted(() => {
    if (categories.value.size === 0) {
        fetchAllCategories()
    }
})
</script>
