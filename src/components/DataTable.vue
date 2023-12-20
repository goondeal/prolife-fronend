<template>
    <div class="w-full max-h-screen overflow-scroll scrolbar-hide">
        <table class="w-full h-full text-sm text-start border border-collapse border-gray-200">
            <thead class="sticky bg-light-bg-secondary dark:bg-dark-bg-secondary top-0">
                <tr class="text-base font-semibold text-center">
                    <th class="w-12 border-collapse border border-gray-200">
                        <input type="checkbox" name="selectAll" v-model="selectAll">
                    </th>
                    <th v-for="header in headers" :key="header"
                        class="w-auto min-w-[6rem] max-w-[8rem] p-2 capitalize border-collapse border-x border-gray-200">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="obj in tasks" :key="obj" class="h-[3rem]">
                    <td class="w-12 text-center p-1 border-collapse border border-gray-200">
                        <input type="checkbox" v-model="obj['__selected']">
                    </td>
                    <td v-for="header in headers" :key="header" @click="editCell(obj[header])"
                        class="text-center min-h-[2rem] text-ellipsis border-collapse border p-1 border-gray-200 hover:cursor-pointer hover:bg-light-bg-highlight dark:hover:bg-dark-bg-highlight">

                        <div v-if="obj[header]['mod'] == 1" class="h-full w-full">
                            <input type="text" v-model="obj[header]['value']" class="w-full h-full p-1">
                        </div>
                        <div v-else>
                            <span v-if="header == 'name'">
                                <RouterLink class="text-blue-700 hover:underline" :to="obj?._href?.value || '#'">
                                    {{ obj['name']['value'] || 'untitled' }}
                                </RouterLink>
                            </span>
                            <span v-else>
                                {{ obj[header]['value'] }}
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="100%">
                        <button @click="showNewTaskModal"
                            class="p-2 w-full hover:bg-light-bg-highlight dark:hover:bg-dark-bg-highlight">
                            <div class="flex items-center text-light-text-muted">
                                <PlusIcon class="w-5 h-5"></PlusIcon>
                                <span class="px-2">New</span>
                            </div>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="w-full">
            <button v-if="modifiedTasksIDs.length != 0" class="p-2 bg-blue-600 text-white" type="button"
                @click="saveChanges">save
                changes</button>
        </div>

        <Teleport to="#app">
            <ModalWrapper v-if="openNewTaskModal" @closeModal="openNewTaskModal = false">
                <NewTaskForm></NewTaskForm>
            </ModalWrapper>
        </Teleport>


        <!-- <Vue3EasyDataTable header-class-name="customize-header" :headers="headers" :items="items" alternating border-cell
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
        </Vue3EasyDataTable> -->
        <Teleport to="#app">
            <ModalWrapper v-if="openModal" @closeModal="openModal = false">
                <ExportTaskForm :taskID="selectedTaskID"></ExportTaskForm>
            </ModalWrapper>
        </Teleport>
    </div>
</template>


<script setup>
import { computed, ref, watch } from 'vue'
// import Vue3EasyDataTable from 'vue3-easy-data-table'
// import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import ModalWrapper from './modals/ModalWrapper.vue'
import ExportTaskForm from './modals/forms/ExportTaskForm.vue'
import NewTaskForm from './modals/forms/NewTaskForm.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'


const props = defineProps({
    data: { type: Array, required: true },
})

const selectAll = ref(false)

const getModifiedData = computed(() => {
    return props.data.map((e) => {
        Object.keys(e).forEach(key => {
            e[key] = {
                mod: 0,
                value: e[key]
            }
        })
        e['__selected'] = false
        return e
    })
})
console.log('Hello fron DataTable')
console.log('getModifiedData =', getModifiedData.value)
const tasks = ref(getModifiedData.value)

const openNewTaskModal = ref(false)
const openModal = ref(false)
const selectedTaskID = ref()

const modifiedTasksIDs = ref([])

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
    return Array.from(attrs)
    // .map(value => {
    //     return {
    //         text: value,
    //         value
    //     }
    // })
})

const editCell = (property) => {
    property['mod'] = 1
}

// const changesHappened = computed(() => {
//     modifiedTasksIDs.i
// })
const saveChanges = () => {
    console.log('saving changes ...')
}

// const items = computed(() => {
//     return props.data || []
// })

// const showExportTaskModal = (id) => {
//     console.log('clicked item = ', id)
//     selectedTaskID.value = id
//     openModal.value = true
// }

const showNewTaskModal = () => {
    // openNewTaskModal.value = true
    const obj = {}
    for (const key of headers.value) {
        obj[key] = {
            mod: 0,
            value: null
        }
    }
    console.log('obj =', obj)
    tasks.value = [...tasks.value, obj]
}


watch(
    tasks,
    (newValue, oldValue) => {
        console.log('tasks changed!')
        for (const i in newValue) {
            const task = newValue[i]
            for (const key of Object.keys(task)) {
                if (task[key]['mod'] == 1 && !modifiedTasksIDs.value.includes(i)) {
                    modifiedTasksIDs.value.push(i)
                }
            }
        }
    },
    { deep: true }
)
watch(
    selectAll,
    (newValue, oldValue) => {
        for (const task of tasks.value) {
            task['__selected'] = newValue
        }
    },
    { deep: true }
)
</script>


<style>
.customize-header {
    --easy-table-header-background-color: #efefef;
}
</style>
