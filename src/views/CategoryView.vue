<template>
    <div class="m-auto p-8">
        <div v-if="category">
            <div class="flex justify-between mb-10 p-2 bg-gray-50">
                <div class="flex items-center justify-start">
                    <div class="w-4 h-4 rounded-full me-3" :style="{ backgroundColor: category.color }"></div>
                    <h2 class="text-xl font-medium text-gray-900 dark:text-white">{{ category.name }} <span
                            class="text-base">({{ numOfProjectsStr }})</span>
                    </h2>
                    <StarIcon v-if="category.is_featured" class="w-8 h-8 ms-2 text-yellow-400"></StarIcon>
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
                        placeholder="Search Projects" required>
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
                <div class="flex">
                    <RouterLink :to="{ name: 'new-project', params: { id: categoryId } }"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        New Project
                    </RouterLink>
                    <div class="flex ms-10">
                        <button @click="openEditCategoryModal = true"
                            class="py-2 px-4 me-2 font-normal text-base border rounded-sm border-gray-900">edit</button>
                        <button @click="openDeleteCategoryModal = true"
                            class="py-2 px-4 font-normal text-base border rounded-sm border-red-600 text-red-600">delete</button>
                    </div>
                </div>
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

                <div v-if="projectsDisplayMode === 'table'">
                    <!-- <DataTable :data="category.projects?.results || []" /> -->
                    <ul>
                        <li v-for="project in category.projects?.results||[]" :key="project.id">{{ project.name }}</li>
                    </ul>

                </div>
                <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <CardView v-for="project in category.projects.results" :key="project.id" :data="project" :href="{ name: 'project-detail', params: { id: $route.params.id, projectID: project.id } }"></CardView>
                </div>
            </div>
            <div v-else>
                <p> Category does not have any projects yet</p>
            </div>
        </div>

        <!-- Delete Category Confirmation Modal -->
        <Teleport to="body">
            <ModalWrapper v-if="openDeleteCategoryModal" @closeModal="openDeleteCategoryModal = false">
                <DeleteCategoryDialog :data="category" />
            </ModalWrapper>
        </Teleport>

        <!-- Edit Category Modal -->
        <Teleport to="body">
            <ModalWrapper v-if="openEditCategoryModal" @closeModal="openEditCategoryModal = false">
                <CreateEditCategoryForm :data="category" :action="editCategory" />
            </ModalWrapper>
        </Teleport>

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
// import DataTable from '../components/DataTable.vue'
import CardView from '../components/CardView.vue'
import ModalWrapper from '../components/modals/ModalWrapper.vue'
import DeleteCategoryDialog from '../components/modals/dialog/DeleteCategoryDialog.vue'
import CreateEditCategoryForm from '../components/modals/forms/CreateEditCategoryForm.vue'
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'


const route = useRoute()
const { sendAuthRequest } = useAuthRequest()

const categoryId = route.params.id
const category = ref({})
// const showDropdown = ref(false)
const projectsDisplayMode = ref('table')


const openDeleteCategoryModal = ref(false)
const openEditCategoryModal = ref(false)
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

const getCategoryProjects = () => {
    searchLoading.value = true
    const params = {}
    if (searchTerm.value) {
        params.search = searchTerm.value
    }
    
    sendAuthRequest({ url: `/categories/${route.params.id}/projects`, method: 'get', params: params })
        .then((response) => {
            console.log('category projects response = ', response)
            if (response.status === 200) {
                category.value.projects = response.data
                // // set project_href attribute
                // category.value.projects.forEach((project) => {
                //     project._href = `${categoryId}/projects/${project.id}`
                // })
            }
        })
        .catch((err) => console.log('category projects err = ', err))
        .finally(() => searchLoading.value = false)
}
const getCategoryData = () => {
    sendAuthRequest({ url: `/categories/${route.params.id}`, method: 'get' })
        .then((response) => {
            console.log('category retrieve response = ', response)
            if (response.status === 200) {
                category.value = response.data
                // set project_href attribute
                // category.value.projects.forEach((project) => {
                //     project._href = `${categoryId}/projects/${project.id}`
                // })
            }
        })
        .then(() => {
            getCategoryProjects()
        })
        .catch((err) => console.log('category retrieve err = ', err))
}

const editCategory = (data, isLoading) => {
    // if (data.name && data.color) {
    isLoading.value = true
    const keys = ['name', 'color', 'is_featured', 'img']
    const changedData = {}
    keys.forEach((key) => {
        if (category.value[key] !== data[key]) {
            changedData[key] = data[key]
        }
    })
    console.log('changedData =', changedData)
    sendAuthRequest({
        url: `/categories/${route.params.id}/`, method: 'patch', data: changedData, config: {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    })
        .then((response) => {
            console.log('category edit response =', response.data)
            if (response.status === 200) {
                category.value = response.data
            }
        }).catch((err) => console.log('addCategory error =', err))
        .finally(
            () => {
                isLoading.value = false
                openEditCategoryModal.value = false

            }
        )
    // }
}

// Search
const searchTerm = ref('')
const searchLoading = ref(false)
var timeoutId = setTimeout(() => { })
const searchAfterTyping = () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
        console.log('search...')
        getCategoryProjects()
    }, 500)
}

onMounted(() => {
    getCategoryData(),
        watch(
            () => route.params.id,
            getCategoryData,
        )
})

</script>
