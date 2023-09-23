<template>
    <div>
        <form method="post" @submit.prevent="onSubmit">
            <div class="p-3 flex-auto text-center justify-center items-center leading-6">
                <h2 class="text-2xl font-bold py-4">New Category</h2>
                <div class="w-fit mx-auto text-start">
                    <input class="rounded block mb-2" v-model="name" type="text" name="name" placeholder="category name"
                        required>
                    <label for="color">color: </label>
                    <input v-model="color" type="color" name="color">
                </div>
            </div>
            <div class="p-3 mt-2 text-center space-x-4 md:block">
                <ModalCancelButton ref="closeBtn"/>
                <input type="submit"
                    class="mb-2 inline-block md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                    :disabled="isLoading" :value="isLoading ? 'Saveing...' : 'Save'">
            </div>
        </form>
    </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import ModalCancelButton from '../ModalCancelButton.vue'
import useAuthRequest from '../../../composables/useAuthRequest'


const { sendAuthRequest } = useAuthRequest()

const name = ref('')
const color = ref('#EEEEEE')
const isLoading = ref(false)

const closeModal = inject('closeModal')
const addCategoryToList = inject('addCategoryToList')


const onSubmit = () => {
if (name.value && color.value) {
    isLoading.value = true

    sendAuthRequest({ url: '/categories/', method: 'post', data: { name: name.value, color: color.value } })
        .then((response) => {
            console.log('response.data =', response.data)
            if (response.status === 201) {
                addCategoryToList(response.data)
                closeModal()
            }
        }).catch((err) => console.log('addCategory error =', err))
        .finally(
            () => {
                isLoading.value = false
            }
        )
}
}

</script>
