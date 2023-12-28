<template>
    <div class="h-screen flex flex-col justify-start items-start z-50 p-8">
        <div class="flex-grow overflow-y-scroll scrolbar-hide">
            <form method="post" @submit.prevent="">
                <input
                    class="block p-2 text-4xl hover-bg-gray-200 focus:bg-white font-bold border-0 active:border-0 focus:border-0 placeholder:font-bold placeholder:text-4xl"
                    v-model="task.name" type="text" name="name" placeholder="Untitled" required>

                <div class="mt-6 flex justify-start items-center">
                    <label class="w-1/4 inline-block capitalize text-light-text-muted" for="description">description</label>
                    <textarea
                        class="flex-grow rounded-md hover:bg-light-bg-highlight focus:bg-white p-2 border-0 hover:border-1 hover:border-gray-200 focus:border-gray-200"
                        name="description" cols="30" rows="5" v-model="task.description"></textarea>
                </div>

                <div class="mt-6 flex justify-start items-center">
                    <label class="w-1/4 inline-block capitalize text-light-text-muted" for="points">points</label>
                    <input
                        class="flex-grow rounded-md hover:bg-light-bg-highlight focus:bg-white p-2 border-0 hover:border-1 hover:border-gray-200 focus:border-gray-200"
                        type="number" name="points" v-model="task.points" required>
                </div>

                <div class="mt-6 p-2 rounded-md hover:bg-light-bg-highlight">
                    <input type="checkbox" name="auto_weight" v-model="task.auto_weight" required>
                    <label class="capitalize ms-4" for="auto_weight">auto weight</label>
                </div>

                <div class="mt-6" :class="{ hidden: task.auto_weight }">
                    <label class="w-1/4 inline-block capitalize text-light-text-muted" for="weight">weight</label>
                    <input
                        class="flex-grow rounded-md hover:bg-light-bg-highlight focus:bg-white p-2 border-0 hover:border-1 hover:border-gray-200 focus:border-gray-200"
                        type="number" name="weight" v-model="task.weight">
                </div>

                <div class="mt-6 flex justify-start items-center" v-for="property in newProps" :key="property">
                    <button @click="delete task[property]" class="rounded hover:bg-gray-200 p-1">
                        <XMarkIcon class="w-6 h-6"></XMarkIcon>
                    </button>
                    <label class="w-1/4 inline-block capitalize text-light-text-muted" for="property">{{ property }}</label>
                    <input
                        class="flex-grow rounded-md hover:bg-light-bg-highlight focus:bg-white p-2 border-0 hover:border-1 hover:border-gray-200 focus:border-gray-200"
                        type="text" :name="property" v-model="task[property]">
                </div>
            </form>
            <div class="mt-8 relative" @mouseleave="showNewPropertyMenu = false">
                <button @click="task[`hi${uid++}`] = 'hello'"
                    class="px-4 py-2 flex justify-start items-center rounded-md text-light-text-muted hover:bg-light-bg-highlight">
                    <PlusIcon class="w-[1.15rem] h-[1.15rem]"></PlusIcon>
                    <span class="ms-2">Add property</span>
                </button>
                <!-- <div class="absolute" :class="showNewPropertyMenu ? 'block' : 'hidden'">
                <ul class="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li @click="$emit('show-new-task-modal')"
                        class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        <div class="p-2 flex justify-start items-center">
                            <PlusIcon class="w-[1.15rem] h-[1.15rem]"></PlusIcon>
                            <span class="ms-2">Add subtask</span>
                        </div>
                    </li>
                    <li @click="$emit('duplicate-once')"
                        class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        <div class="p-2 flex justify-start items-center">
                            <DocumentDuplicateIcon class="w-[1.15rem] h-[1.15rem]"></DocumentDuplicateIcon>
                            <span class="ms-2">Duplicate once</span>
                        </div>
                    </li>
                    <li @click="$emit('duplicate-n-times')"
                        class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        <div class="p-2 flex justify-start items-center">
                            <CircleStackIcon class="w-[1.15rem] h-[1.15rem]"></CircleStackIcon>
                            <span class="ms-2">Duplicate n times</span>
                        </div>
                    </li>
                </ul>
            </div> -->
            </div>
        </div>
        <div class="w-full mt-6 flex justify-end items-center">
            <ModalCancelButton />
            <button @click="onSubmit"
                class="ms-4 mb-2 inline-block md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                :disabled="isLoading">
                {{isLoading ? 'Saveing...' : 'Save'}}
            </button>
        </div>
    </div>
</template>


<script setup>
import { computed, ref, defineEmits } from 'vue'
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import ModalCancelButton from '../ModalCancelButton.vue'


const emit = defineEmits(['submit'])
// const NEW_PROPERTY_TYPES = [
//     'text',
//     'number',
//     'datetime',
//     'checkbox'
// ]

let uid = 0
const task = ref({ name: '', description: '', auto_weight: true, progress:0, weight: 0, points: 1 })
const showNewPropertyMenu = ref(false)
const isLoading = ref(false)
const newProps = computed(() => {
    const defaultProps = new Set(['name', 'description', 'auto_weight', 'weight', 'points', 'progress'])
    return Object.keys(task.value).filter((key) => !defaultProps.has(key))
})
const onSubmit = () => {
    emit('submit', task.value)
}
</script>
