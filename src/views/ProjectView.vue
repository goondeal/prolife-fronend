<template>
    <div class="m-auto p-8 h-full">
        <div class="flex items-center">
            <h2 class="text-xl font-medium text-gray-900 dark:text-white">Pro-{{ route.params.projectID }}</h2>
            <div class="w-8"></div>
            <TrashIcon class="rounded-full p-1 h-8 w-8 text-red-500 hover:bg-gray-200"
            @click="deleteProject()"></TrashIcon>

        </div>
        <div v-if="project._tasks" class="my-4">
            <div class="flex">
                
            </div>
            <DataTable :data="project._tasks" />
        </div>
        <div v-else>
            <p> Category does not have any projects yet</p>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import useAuthRequest from '../composables/useAuthRequest'
import { TrashIcon,  } from '@heroicons/vue/24/outline'
import DataTable from '../components/DataTable.vue'


const route = useRoute()
const router = useRouter()
const { sendAuthRequest } = useAuthRequest()
const project = ref({})

const getProjectData = () => {
    sendAuthRequest({ url: `/categories/${route.params.id}/projects/${route.params.projectID}`, method: 'get' })
        .then((response) => {
            console.log('project retrieve response = ', response)
            if (response.status === 200) {
                project.value = response.data
                if (project.value._tasks) {
                    // set project_href attribute
                    project.value._tasks.forEach((task) => {
                        task.id = task.id - project.value.id
                        task._href = `${route.params.projectID}/tasks/${task.id}`
                    })
                }
            }
        }).catch((err) => console.log('project retrieve err = ', err))
}

onMounted(() => {
    getProjectData(),
        watch(
            () => route.params.projectID,
            getProjectData,
        )
})

const deleteProject = () => {
    sendAuthRequest({ url: `/categories/${route.params.id}/projects/${route.params.projectID}`, method: 'delete' })
        .then((response) => {
            console.log('project delete response = ', response)
            if (response.status === 204) {
                router.replace({name: 'category-detail', params: {id: route.params.id}})
            }
        }).catch((err) => console.log('project delete err = ', err))
}
</script>
