<template>
    <div class="w-full bg-gray-50">
        <div class="p-1 flex flex-wrap justify-start items-center">
            <div class="me-4 px-1 flex items-center rounded-md border border-light-text-muted" 
             v-for="(tag, index) of selectedTags" :key="tag.id">
             <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: tag.color }"></span>
                <span class="mx-1">{{ tag.name }}</span>
                <button class="rounded-full" @click="selectedTags.splice(index, 1)">
                    <XMarkIcon class="w-4 h-4 hover:bg-light-bg-highlight"></XMarkIcon>
                </button>
            </div>
        </div>
        <div class="relative">
            <div class="relative me-4 flex-grow flex justify-center items-center">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type="search" v-model="searchTerm" @keyup="searchAfterTyping"
                    class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:border-blue-500"
                    placeholder="Search project tasks">
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
            <div class="py-2">
                <button v-if="!searchTermInResults" class="flex p-1 w-full hover:bg-gray-100">
                    <span class="text-light-text-muted">add new tag:</span> <span class="font-medium ms-2">{{ searchTerm }}</span></button>
                <ul v-if="searchResults != null">
                    <span v-if="searchResults.length === 0 && searchTerm">No results found</span>
                    <li @click="selectedTags.push(tag)" v-for="tag in searchResults" :key="tag.id"
                    class="flex items-center p-1 border-y border-collapse hover:bg-gray-100 hover:cursor-pointer">
                    <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: tag.color }"></span>    
                    <span class="mx-2">{{ tag.name }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import useAuthRequest from '../composables/useAuthRequest'
import { XMarkIcon } from '@heroicons/vue/24/outline'


const { sendAuthRequest } = useAuthRequest()

const selectedTags = ref([])
// Search
const searchTerm = ref('')
const searchResults = ref(null)
const searchLoading = ref(false)

const searchTags = () => {
    searchLoading.value = true
    const params = {}
    if (searchTerm.value) {
        params.search = searchTerm.value
    }
    sendAuthRequest({ url: `/tags`, method: 'get', params: params })
        .then((response) => {
            console.log('tags response = ', response)
            if (response.status === 200) {
                searchResults.value = response.data.results
            }
        })
        .catch((err) => console.log('tags fetch err = ', err))
        .finally(() => searchLoading.value = false)
}

const searchTermInResults = computed(() => {
    let res = false
    if (searchResults.value && searchTerm.value) {
        const tags = new Set(searchResults.value.map((tag) => tag.name))
        res = tags.has(searchTerm.value)
    }
    return res
})

var timeoutId = setTimeout(() => { })
const searchAfterTyping = () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
        searchTags()
    }, 500)
}
</script>
