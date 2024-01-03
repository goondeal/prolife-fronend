<template>
    <div class="h-screen flex flex-col justify-start items-start z-50 py-8 px-2">
        <div class="flex-grow overflow-y-scroll scrolbar-hide">
            <div v-for="(prop, index) of propsArray" :key="index" @mouseenter="hoveredIndex = index" class="mb-4 w-full flex justify-start items-center">
                <div class="w-6 h-6 me-4">
                    <button v-if="!defaultProps.has(prop.name) && hoveredIndex === index" @click="propsArray.splice(index, 1)">
                        <XMarkIcon class="w-6 h-6 rounded hover:bg-gray-200"></XMarkIcon>
                    </button>
                </div>
                <form @submit.prevent="submitProp(index)" class="flex-grow flex justify-start items-center">
                    <input v-if="prop.name === 'name'"
                        class="block p-2 text-4xl hover-bg-gray-200 focus:bg-white font-bold border-0 active:border-0 focus:border-0 placeholder:font-bold placeholder:text-4xl"
                        :class="{'border-2 border-red-500': !prop.value}"
                        v-model="prop.value" type="text" name="name" placeholder="Name" required>

                    <div v-else class="w-full flex justify-start items-center"
                        :class="{ 'flex-row-reverse': prop.inputType === 'checkbox' }">

                        <div v-if="prop.inputType === 'checkbox'" class="flex-grow"></div>
                        <input v-if="prop.edit" @focusout="prop.edit=prop.name ? false: true"
                        class="w-1/4 mx-2 rounded-md hover:bg-light-bg-highlight focus:bg-white p-2 border-0"
                        :class="{'border-2 border-red-500 text-red-500': !isValidPropName(index, prop.name)}" 
                        type="text" v-model="prop.name" required>
                        <label v-else @click="prop.edit = true"
                            class="w-1/4 me-2 inline-block capitalize text-light-text-muted" 
                            :class="!isValidPropName(index, prop.name) ? 'text-red-500' : 'text-light-text-muted'"
                            :for="prop.name">
                            {{ prop.name }}
                        </label>
                        <TagSelector v-if="prop.name==='tags'"></TagSelector>
                        <textarea v-else-if="prop.inputType === 'textarea'"
                            class="flex-grow rounded-md hover:bg-light-bg-highlight focus:bg-white p-2 border-0 hover:border-1 hover:border-gray-200 focus:border-gray-200"
                            :name="prop.name" cols="30" rows="5" v-model="prop.value"></textarea>
                        
                            <input v-else
                            class="mx-2 rounded-md hover:bg-light-bg-highlight focus:bg-white p-2 border-0 hover:border-1 hover:border-gray-200 focus:border-gray-200"
                            :class="{'flex-grow': prop.inputType !== 'checkbox'}"
                            :type="prop.inputType" :name="prop.name" v-model="prop.value">
                                                    
                    </div>
                    <input type="submit" value="" class="hidden">
                </form>
            </div>
            <div class="mt-8 relative" @mouseleave="showNewPropertyMenu = false">
                <button @click="addNewProp"
                    class="px-4 py-2 flex justify-start items-center rounded-md text-light-text-muted hover:bg-light-bg-highlight">
                    <PlusIcon class="w-[1.15rem] h-[1.15rem]"></PlusIcon>
                    <span class="ms-2">Add a property</span>
                </button>
            </div>
        </div>
        <div class="w-full mt-6 flex justify-end items-center">
            <ModalCancelButton />
            <button @click="onSubmit"
                class="ms-4 mb-2 inline-block md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                :disabled="isLoading">
                {{ isLoading ? 'Saveing...' : 'Save' }}
            </button>
        </div>
    </div>
</template>


<script setup>
import { computed, ref, defineEmits, defineProps } from 'vue'
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import ModalCancelButton from '../ModalCancelButton.vue'
import TagSelector from '../../TagSelector.vue'


const props = defineProps({
    task: {
        type: Object,
        default: () => {
            return {
                name: { value: '', type: 'text' },
                tags: { value: [], type: 'text' },
                description: { value: '', type: 'textarea' },
                auto_weight: { value: true, type: 'checkbox' },
                // progress: { value: 0, type: 'number' },
                weight: { value: 10, type: 'number', config: { min: 0, max: 100 } },
                points: { value: 1, type: 'number', config: { min: 1 } }
            }
        }
    }
})

const emit = defineEmits(['submit'])
// const NEW_PROPERTY_TYPES = [
//     'text',
//     'number',
//     'datetime',
//     'checkbox'
// ]

const getPropsArrayFromTask = (taskObject) => {
    return Object.keys(taskObject).map((key) => {
        return {
            name: key,
            value: taskObject[key]['value'],
            edit: false,
            inputType: taskObject[key]['type']
        }
    })
}
const getTaskFromPropsArray = computed(() => {
    const obj = {}
    validPropsArray.value.forEach((e) => {
        obj[e.name] = e.value
    })
    if (obj.tags) {
        obj.tags = obj.tags.map((tag) => tag.id)
    }
    return obj
})
const propsArray = ref(getPropsArrayFromTask(props.task))
const hoveredIndex = ref(-1)
const showNewPropertyMenu = ref(false)
const isLoading = ref(false)
const defaultProps = new Set(['name', 'description', 'auto_weight', 'weight', 'points', 'tags', 'progress'])

const validPropsArray = computed(() => {
    return propsArray.value.filter((e) => e.name)
})

const isValidPropName = (propIndex, name) => {
    return name && propsArray.value.findIndex((e) => e.name === name) === propIndex
}
const onSubmit = () => {
    console.log('origin task =', getTaskFromPropsArray.value)
    if (getTaskFromPropsArray.value.name) {
        emit('submit', getTaskFromPropsArray.value)
    }
}

const submitProp = (index) => {
    propsArray.value[index].edit = false
    console.log('submitProp =', propsArray.value[index])
}

const addNewProp = () => {
    propsArray.value.push(
        {
            name: '',
            value: '',
            edit: true,
            inputType: 'text'
        }
    )
}
</script>
