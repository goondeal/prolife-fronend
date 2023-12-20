<template>
    <div class="my-12">
        <div class="flex items-center justify-between p-2">
            <h3 class="text-light-text-secondary dark:text-dark-text-secondary text-sm font-semibold mb-2">
                Categories
            </h3>
            <button @click="openModal = true"
                class="hover:bg-light-bg-highlight dark:hover:bg-dark-bg-highlight p-1 rounded-full">
                <svg class="w-5 h-5 cursor-pointer" enable-background="new 0 0 50 50" height="50px" version="1.1"
                    viewBox="0 0 50 50" width="50px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect fill="none" height="50" width="50" />
                    <line fill="none" stroke="#333" stroke-miterlimit="10" stroke-width="3" x1="9" x2="41" y1="25"
                        y2="25" />
                    <line fill="none" stroke="#333" stroke-miterlimit="10" stroke-width="3" x1="25" x2="25" y1="9"
                        y2="41" />
                </svg>
            </button>
        </div>

        <ul>
            <li v-for="category in categories" :key="category.id"
                class="hover:bg-light-bg-highlight dark:hover:bg-dark-bg-highlight dark:text-dark-text-primary font-medium rounded-md">
                <RouterLink :to="{ name: 'category-detail', params: { id: category.id } }" class="block w-full h-full p-2">
                    <div class="flex items-center">
                        <div class="w-2 h-2 rounded-full" :style="{ 'background-color': category.color }"></div>
                        <h3 class="inline-block mx-4">{{ category.name }}</h3>
                        <!-- <span>{{ category.projects_count }}</span> -->
                    </div>
                </RouterLink>
            </li>
        </ul>

        <Teleport to="body">
            <ModalWrapper v-if="openModal" @closeModal="openModal = false">
                <CreateEditCategoryForm :action="createNewCategory"/>
            </ModalWrapper>
        </Teleport>
    </div>
</template>


<script setup>
import { ref, onMounted, provide } from 'vue'
import useAuthRequest from '../../composables/useAuthRequest'
import ModalWrapper from '../modals/ModalWrapper.vue'
import CreateEditCategoryForm from '../modals/forms/CreateEditCategoryForm.vue'


const { sendAuthRequest } = useAuthRequest()
const categories = ref([])

const openModal = ref(false)

const addCategoryToList = (newCategory) => categories.value.push(newCategory)
provide('addCategoryToList', addCategoryToList)

const getCategories = () => {
    sendAuthRequest({ url: '/categories', method: 'get' })
        .then((response) => {
            console.log('response.data =', response.data)
            if (response.status === 200) {
                categories.value = response.data.results
            }
        }).catch((err) => console.log('getCategories error =', err))
}

const createNewCategory = (data, isLoading) => {
        isLoading.value = true

        sendAuthRequest({ url: '/categories/', method: 'post', data: data, config: {
            headers: {'Content-Type': 'multipart/form-data'}
        }})
            .then((response) => {
                console.log('response.data =', response.data)
                if (response.status === 201) {
                    addCategoryToList(response.data)
                }
            }).catch((err) => console.log('addCategory error =', err))
            .finally(
                () => {
                    isLoading.value = false
                    openModal.value = false

                }
            )
}

onMounted(() => getCategories())


</script>
