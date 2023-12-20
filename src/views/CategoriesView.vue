<template>
    <div class="m-auto p-8">
        <div class="">
            <div
                class="min-w-[300px] p-2 flex flex-wrap items-center justify-between bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div class="flex items-center justify-start">
                    <span class="mx-4">{{ categories?.results?.length || 0 }} categories of {{ categories?.count || 0
                    }}</span>
                    <input class="mx-2" type="checkbox" name="featured" v-model="filterFeatured"
                        @change="getCategoriesData">
                    <label for="featured">only featured</label>
                </div>
                <div class="relative mx-4 flex-grow">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="category-search" v-model="searchTerm" @keyup="searchAfterTyping"
                        class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:border-blue-500"
                        placeholder="Search Categories" required>
                    <div role="status" class="flex items-center absolute inset-y-0 end-0 pe-3"
                        :class="searchLoading ? '' : 'hidden'">
                        <svg aria-hidden="true"
                            class="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>

                <button @click="openModal = true"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-sm text-white font-medium">New
                    Category</button>
            </div>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <CardView v-for="c in categories.results" :key="c.id" :data="c" :href="{name: 'category-detail', params: {id: c.id}}"/>
            </div>
        </div>

        <Teleport to="body">
            <ModalWrapper v-if="openModal" @closeModal="openModal = false">
                <CreateEditCategoryForm />
            </ModalWrapper>
        </Teleport>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
// import { useRoute } from 'vue-router'
// import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import useAuthRequest from '../composables/useAuthRequest'
import CardView from '../components/CardView.vue'
import ModalWrapper from '../components/modals/ModalWrapper.vue'
import CreateEditCategoryForm from '../components/modals/forms/CreateEditCategoryForm.vue'
// import { ListBulletIcon, Squares2X2Icon } from '@heroicons/vue/24/outline'


const { sendAuthRequest } = useAuthRequest()

const categories = ref({})

// Search
const searchTerm = ref('')
const filterFeatured = ref(false)
const searchLoading = ref(false)
// const showDropdown = ref(false)


const openModal = ref(false)

const getCategoriesData = () => {
    searchLoading.value = true
    const params = {}
    if (searchTerm.value) {
        params.search = searchTerm.value
    }
    if (filterFeatured.value) {
        params.featured = true
    }
    sendAuthRequest({ url: '/categories/', method: 'get', params: params })
        .then((response) => {
            console.log('category list response = ', response)
            if (response.status === 200) {
                categories.value = response.data
            }
        })
        .catch((err) => console.log('category list err = ', err))
        .finally(() => searchLoading.value = false)
}


var timeoutId = setTimeout(() => { })
const searchAfterTyping = () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
        console.log('search...')
        getCategoriesData()
    }, 500)
}


// Display mode dropdown
// const displayMode = ref('list')
// const openDisplayModeMenu = ref(false)
// const setDisplayMode = (newMode) => {
//     if (newMode !== displayMode.value) {
//         displayMode.value = newMode
//     }
//     openDisplayModeMenu.value = false
// }

onMounted(() => {
    getCategoriesData()
})

</script>
