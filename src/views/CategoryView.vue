<template>
    <div class="m-auto p-8">
        <div v-if="category">
            <div class="flex m-4 justify-between">
                <h2 class="text-xl font-medium text-gray-900 dark:text-white">{{ category.name }} ({{ numOfProjectsStr }})
                </h2>

                <RouterLink :to="{ name: 'new-project', params: { id: categoryId } }"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    New Project </RouterLink>

                <!-- <div class="max-w-20 overflow-hidden">
                    <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        @click="showMenu" type="button">
                        New Project
                        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    
                    <div id="dropdownHover"
                        class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                        :class="{ hidden: !showDropdown }">

                        <ul class="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                            <li>
                                <button @click="toggleUploadFileModal"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    From .json file</button>
                            </li>
                            <li>
                                <RouterLink :to="{name: 'new-project', params: {id: categoryId}}"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Open
                                    editor</RouterLink>
                            </li>
                            <li>
                                <a href="#"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Step
                                    by step</a>
                            </li>
                        </ul>
                    </div>
                </div> -->
            </div>

            <div v-if="category">
                <div class="flex mb-1">
                    <list-bullet-icon class="h-10 w-10 p-2 text-black hover:bg-gray-200 hover:cursor-pointer rounded-md"
                        :class="projectsDisplayMode === 'table' ? 'bg-gray-200' : 'bg-transparent'"
                        @click="projectsDisplayMode = 'table'"></list-bullet-icon>
                    <squares-2-x-2-icon
                        class="h-10 w-10 p-2 mx-2 text-black hover:bg-gray-200 hover:cursor-pointer rounded-md"
                        :class="projectsDisplayMode === 'cards' ? 'bg-gray-200' : 'bg-transparent'"
                        @click="projectsDisplayMode = 'cards'"></squares-2-x-2-icon>
                </div>

                <DataTable v-if="projectsDisplayMode === 'table'" :data="category.projects" />
                <div v-else>
                    <div v-for="project in category.projects" :key="project.id" class="flex">
                        <div
                            class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href="#">
                                <img class="rounded-t-lg" :src="project.img" :alt="project.name" />
                            </a>
                            <div class="p-5">
                                <a href="#">
                                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {{ project.name }}</h5>
                                </a>
                                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise
                                    technology acquisitions of 2021 so far, in reverse chronological order.</p>
                                <a href="#"
                                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Open
                                    <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p> Category does not have any projects yet</p>
            </div>
        </div>

        <Teleport to="body">
            <div v-if="modalIsOpen" @click="toggleUploadFileModal" class="absolute flex bg-black opacity-70 inset-0 z-10">
                <div class="w-full max-w-lg p-2 relative mx-auto my-auto rounded-lg shadow-lg bg-white">
                    <form method="post" @submit.prevent="submitFile">
                        <div class=" flex-auto text-center justify-center items-center leading-6">
                            <h2 class="text-2xl font-bold py-4">New Project</h2>
                            <div class="w-fit mx-auto my-6 text-start">
                                <label>File:
                                    <input type="file" accept=".json" @change="handleFileUpload($event)" required />
                                </label>
                            </div>
                        </div>
                        <div class="p-3 mt-2 text-center space-x-4 md:block">
                            <button @click="toggleUploadFileModal"
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import useAuthRequest from '../composables/useAuthRequest'
import DataTable from '../components/DataTable.vue'
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/vue/24/outline'


const route = useRoute()
const { sendAuthRequest } = useAuthRequest()

const categoryId = route.params.id
const category = ref({})
// const showDropdown = ref(false)
const projectsDisplayMode = ref('table')


const modalIsOpen = ref(false)
const toggleUploadFileModal = () => modalIsOpen.value = !modalIsOpen.value
const file = ref('')

const handleFileUpload = ($event) => {
    const target = $event.target
    if (target && target.files) {
        file.value = target.files[0]
    }
}

const isLoading = ref(false)

const submitFile = () => {
    let formData = new FormData()
    formData.append('file', file.value)

    isLoading.value = true
    sendAuthRequest({
        url: `/categories/${categoryId}/projects/`, method: 'post', data: formData, config: {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    })
        .then(function () {
            console.log('SUCCESS!!');
        })
        .catch(function () {
            console.log('FAILURE!!');
        }).finally(
            () => {
                isLoading.value = false
                modalIsOpen.value = false
            }
        )
}

const numOfProjectsStr = computed(() => {
    if (category.value) {
        const projects_count = category.value.projects_count
        return `${projects_count} ${projects_count == 1 ? 'project' : 'projects'}`
    }
    return ''
})

// const showMenu = () => showDropdown.value = !showDropdown.value

const getCategoryData = () => {
    sendAuthRequest({ url: `/categories/${route.params.id}`, method: 'get' })
        .then((response) => {
            console.log('category retrieve response = ', response)
            if (response.status === 200) {
                category.value = response.data
                // set project_href attribute
                category.value.projects.forEach((project) => {
                    project._href = `${categoryId}/projects/${project.id}`
                })
            }
        }).catch((err) => console.log('category retrieve err = ', err))
}

onMounted(() => {
    getCategoryData(),
        watch(
            () => route.params.id,
            getCategoryData,
        )
})

</script>
