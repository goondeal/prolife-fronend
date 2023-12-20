<template>
    <div class="relative p-4 w-full max-w-md max-h-full">
        <!-- <div class="relative bg-white rounded-lg dark:bg-gray-700"> -->
            <div class="p-4 md:p-5 text-center">
                <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete <span class="font-semibold text-gray-800">{{props.data.name}}</span> category?
                </h3>
                <div class="flex mb-5">
                    <input type="checkbox" name="hard-deletion" v-model="hardDeletion">
                    <label class="ms-2" for="hard-deletion">Delete all projects even if it was in another category</label>
                </div>
                <TheSpinner class="inline-flex items-center px-5 py-2.5 text-center me-2" v-if="isLoading"/>
                <button v-else @click="deleteCategory" type="button"
                    class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                    Delete
                </button>
                <!-- <button data-modal-hide="popup-modal" type="button"
                    class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                    Cancel
                </button> -->
                <ModalCancelButton ref="closeBtn" />
            </div>
        <!-- </div> -->
    </div>
</template>

<script setup>

import {ref, defineProps, inject} from 'vue'
import { useRouter } from 'vue-router'
import ModalCancelButton from '../ModalCancelButton.vue'
import TheSpinner from '../../TheSpinner.vue'
import useAuthRequest from '../../../composables/useAuthRequest'


const { sendAuthRequest } = useAuthRequest()
const router = useRouter()

const props = defineProps({
    data: {type: Object, required: true}
})

const closeModal = inject('closeModal')

const hardDeletion = ref(false)
const isLoading = ref(false)

const deleteCategory = () => {
    isLoading.value = true
    sendAuthRequest({ url: `/categories/${props.data.id}`, method: 'delete', data: {hard: hardDeletion.value} })
        .then((response) => {
            console.log('category deletion response = ', response)
            if (response.status === 204) {
                closeModal()
                router.back()
            }
        })
        .catch((err) => console.log('category retrieve err = ', err))
        .finally(() => isLoading.value = false)
}
</script>
