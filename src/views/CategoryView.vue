<template>
    <div class="max-w-lg m-auto p-2">
        <div v-if="category">
            <div>
                <h2 class="text-4xl font-medium text-gray-900 dark:text-white">{{ category.name }}</h2>
            </div>
            <Vue3EasyDataTable :headers="headers" :items="items" alternating border-cell />

            <div v-if="category.projects">
                <div class="mt-6" v-for="project in category.projects" :key="project.id">
                    <p>{{ project.name }}</p>
                </div>
            </div>
            <p v-else>
                Category does not have any projects yet
            </p>
        </div>

    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import { useUserStore } from '../stores/user';
// import 'vue3-easy-data-table/dist/style.css';


const route = useRoute()
const userStore = useUserStore()
const categoryId = route.params.id
const category = ref(null)

const headers = ref([
    { text: "PLAYER", value: "player" },
    { text: "TEAM", value: "team" },
    { text: "NUMBER", value: "number" },
    { text: "POSITION", value: "position" },
    { text: "HEIGHT", value: "indicator.height" },
    { text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true },
    { text: "LAST ATTENDED", value: "lastAttended", width: 200 },
    { text: "COUNTRY", value: "country" },
]);
const items = ref([
    { player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: { "height": '6-2', "weight": 185 }, lastAttended: "Davidson", country: "USA" },
    { player: "Lebron James", team: "LAL", number: 6, position: 'F', indicator: { "height": '6-9', "weight": 250 }, lastAttended: "St. Vincent-St. Mary HS (OH)", country: "USA" },
    { player: "Kevin Durant", team: "BKN", number: 7, position: 'F', indicator: { "height": '6-10', "weight": 240 }, lastAttended: "Texas-Austin", country: "USA" },
    { player: "Giannis Antetokounmpo", team: "MIL", number: 34, position: 'F', indicator: { "height": '6-11', "weight": 242 }, lastAttended: "Filathlitikos", country: "Greece" },
]);

onMounted(() => {
    axios.get(
        `/categories/${categoryId}`,
        {
            headers: {
                'Authorization': `Token ${userStore.accessToken}`
            }
        }
    ).then((response) => {
        console.log('category retrieve response = ', response)
        if (response.status === 200) {
            category.value = response.data
        }
    }).catch((err) => console.log('category retrieve err = ',err))
})

</script>
