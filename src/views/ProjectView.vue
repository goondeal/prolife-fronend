<template>
    <div class="m-auto p-8 h-full">
        <h2 class="text-xl font-medium text-gray-900 dark:text-white">Pro-{{ route.params.projectID }}</h2>
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
import { useRoute } from 'vue-router';
import useAuthRequest from '../composables/useAuthRequest'
import DataTable from '../components/DataTable.vue'


const route = useRoute()
const { sendAuthRequest } = useAuthRequest()
const project = ref({})

const getCategoryData = () => {
    sendAuthRequest({ url: `/categories/${route.params.id}/projects/${route.params.projectID}`, method: 'get' })
        .then((response) => {
            console.log('project retrieve response = ', response)
            if (response.status === 200) {
                project.value = response.data
                if (project.value._tasks) {
                    // set project_href attribute
                    project.value._tasks.forEach((task) => {
                        task._href = `${route.params.projectID}/tasks/${task.id}`
                    })
                }
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
