<template>
    <div class="m-auto p-8 h-full">
        <h2 class="text-xl font-medium text-gray-900 dark:text-white">Task-{{ route.params.taskID }}</h2>
        <div v-if="task._tasks" class="my-4">
            <div class="flex">
                
            </div>
            <DataTable :data="task._tasks" />
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
const task = ref({})

const getTaskData = () => {
    sendAuthRequest({ url: `/categories/${route.params.id}/projects/${route.params.projectID}/tasks/${route.params.taskID}`, method: 'get' })
        .then((response) => {
            console.log('task retrieve response = ', response)
            if (response.status === 200) {
                task.value = response.data
                if (task.value._tasks) {
                    // set project_href attribute
                    task.value._tasks.forEach((task) => {
                        task._href = `${task.id}`
                    })
                }
            }
        }).catch((err) => console.log('category retrieve err = ', err))
}

onMounted(() => {
    getTaskData(),
        watch(
            () => route.params.taskID,
            getTaskData,
        )
})

</script>
