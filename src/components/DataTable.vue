<template>
    <div>
        <Vue3EasyDataTable header-class-name="customize-header" :headers="headers" :items="items" alternating border-cell
            hide-footer>
            <template #header="header">
                <div class="text-sm font-medium">
                    {{ header.text.charAt(0).toUpperCase() + header.text.slice(1) }}
                </div>
            </template>
            <template #item-name="{ id, name, _href, is_leaf }">
                <div class="flex justify-between items-center min-w-[100px] w-fit">
                    <RouterLink class="text-blue-700 hover:underline" :to="_href">{{ name
                    }}</RouterLink>

                    <ellipsis-vertical-icon v-if="is_leaf" @click="showExportTaskModal(id)"
                        class="w-6 h-6 p-1 text-gray-900 rounded-full hover:bg-gray-300">

                    </ellipsis-vertical-icon>
                </div>
            </template>
        </Vue3EasyDataTable>
        <Teleport to="#app">
            <ModalWrapper v-if="openModal" @closeModal="openModal = false">
                <ExportTaskForm :taskID="selectedTaskID"></ExportTaskForm>
            </ModalWrapper>
        </Teleport>
    </div>
</template>


<script setup>
import { computed, ref } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import ModalWrapper from './modals/ModalWrapper.vue'
import ExportTaskForm from './modals/forms/ExportTaskForm.vue'


const props = defineProps({
    data: { type: Object, required: true },
})

const openModal = ref(false)
const selectedTaskID = ref()

const headers = computed(() => {
    const attrs = new Set()
    const rows = props.data
    if (rows) {
        rows.forEach(row => {
            Object.keys(row).forEach(key => {
                if (!key.startsWith('_')) {
                    attrs.add(key)
                }
            })
        })
        attrs.delete('id')
        console.log('attrs = ', attrs)
    }
    return Array.from(attrs).map(value => {
        return {
            text: value,
            value
        }
    })
})

const items = computed(() => {
    return props.data || []
})

const showExportTaskModal = (id) => {
    console.log('clicked item = ', id)
    selectedTaskID.value = id
    openModal.value = true
}

// const headers = ref([
// { text: "PLAYER", value: "player" },
// { text: "TEAM", value: "team" },
// { text: "NUMBER", value: "number" },
// { text: "POSITION", value: "position" },
// { text: "HEIGHT", value: "indicator.height" },
// { text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true },
// { text: "LAST ATTENDED", value: "lastAttended", width: 200 },
// { text: "COUNTRY", value: "country" },
// ])

// const items = ref([
// { player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: { "height": '6-2', "weight": 185 }, lastAttended: "Davidson", country: "USA" },
// { player: "Lebron James", team: "LAL", number: 6, position: 'F', indicator: { "height": '6-9', "weight": 250 }, lastAttended: "St. Vincent-St. Mary HS (OH)", country: "USA" },
// { player: "Kevin Durant", team: "BKN", number: 7, position: 'F', indicator: { "height": '6-10', "weight": 240 }, lastAttended: "Texas-Austin", country: "USA" },
// { player: "Giannis Antetokounmpo", team: "MIL", number: 34, position: 'F', indicator: { "height": '6-11', "weight": 242 }, lastAttended: "Filathlitikos", country: "Greece" },
// ]);

</script>


<style>
.customize-header {
    --easy-table-header-background-color: #efefef;
}
</style>
