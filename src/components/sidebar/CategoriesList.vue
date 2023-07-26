<template>
    <div>
        <div class="flex items-center justify-between">
            <h3 class="text-gray-800 dark:text-gray-400 text-sm mb-2">
                Categories
            </h3>
            <button @click="toggleNewCategoryModal" class="hover:bg-gray-300 dark:hover:bg-dark-hover p-1 rounded-full">
                <svg class="w-[18px] h-[18px] cursor-pointer" enable-background="new 0 0 50 50" height="50px" id="Layer_1"
                    version="1.1" viewBox="0 0 50 50" width="50px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect fill="none" height="50" width="50" />
                    <line fill="none" stroke="#333" stroke-miterlimit="10" stroke-width="4" x1="9" x2="41" y1="25"
                        y2="25" />
                    <line fill="none" stroke="#333" stroke-miterlimit="10" stroke-width="4" x1="25" x2="25" y1="9"
                        y2="41" />
                </svg>
            </button>
        </div>

        <ul v-for="category in categories" :key="category.id">
            <RouterLink :to="{ name: 'category-detail', params: { id: category.id } }">
                <li :class="'hover:bg-[' + category.color + '] text-gray-900 dark:text-white text-sm font-medium p-2'">
                    {{ category.name }}
                </li>
            </RouterLink>
        </ul>

        <Teleport to="body">
            <div v-if="modalIsOpen">
                <div @click="toggleNewCategoryModal" class="absolute bg-black opacity-70 inset-0 z-0"></div>
                <div class="w-full max-w-lg p-3 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
                    <form method="post" @submit="onSubmit">
                        <div class="p-3 flex-auto text-center justify-center items-center leading-6">
                            <h2 class="text-2xl font-bold py-4">New Category</h2>
                            <div class="w-fit mx-auto text-start">
                                <input class="rounded block mb-2" v-model="name" type="text" name="name"
                                    placeholder="category name" required>
                                <label for="color">color: </label>
                                <input v-model="color" type="color" name="color">
                            </div>
                        </div>
                        <div class="p-3 mt-2 text-center space-x-4 md:block">
                            <button @click="toggleNewCategoryModal"
                                class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100">
                                Close
                            </button>
                            <input
                                class="mb-2 inline-block md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                                :disabled="isLoading" type="submit" :value="isLoading ? 'Saveing...' : 'Save'">
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '../../stores/user';

const userStore = useUserStore()
const categories = ref([])

const modalIsOpen = ref(false)
const toggleNewCategoryModal = () => modalIsOpen.value = !modalIsOpen.value

const name = ref('')
const color = ref('#EEEEEE')
const isLoading = ref(false)

const getCategories = () => {
    axios
        .get('/categories', {
            headers: {
                'Authorization': `Token ${userStore.accessToken}`
            }
        })
        .then((response) => {
            console.log('response.data =', response.data)
            categories.value = response.data.results
        })
}

onMounted(() => getCategories())




const onSubmit = (e) => {
    e.preventDefault()

    if (name.value && color.value) {
        isLoading.value = true
        axios.post(
            '/categories',
            { name: name.value, color: color.value }
        ).then((response) => console.log('response.data =', response.data))
            .finally(
                () => {
                    isLoading.value = false
                    modalIsOpen.value = false
                }
            )
    }
}


</script>
