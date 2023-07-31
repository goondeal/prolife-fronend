<template>
    <div>
        <h3 class="dark:text-gray-400 text-sm mb-2">
            Latest Projects
        </h3>
        <ul v-for="project in projects" :key="project.id">
            <RouterLink :to="{ name: 'projects-id', params: { id: project.id } }">
                <li class="text-white text-sm font-medium p-2 hover:bg-dark-hover">
                    {{ project.name }}
                </li>
            </RouterLink>
        </ul>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import useAuthRequest from '../../composables/useAuthRequest'


const { sendAuthRequest } = useAuthRequest()
const projects = ref([])

const getProjects = () => {
    sendAuthRequest({ url: '/latest-projects', method: 'get' })
        .then((response) => {
            console.log('response.data =', response.data)
            projects.value = response.data.results
        })
}

onMounted(() => getProjects())

</script>