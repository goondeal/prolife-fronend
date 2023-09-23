<template>
    <div>
        <form method="post" @submit.prevent="onSubmit">
            <div class="text-center leading-6">
                <h2 class="text-2xl font-bold">Export Task To Calendar</h2>
                <div class="my-8 w-fit flex flex-col items-start">
                    <label for="from">From:</label>
                    <input class="border border-gray-300 px-2 rounded-sm" v-model="from_time" type="datetime-local" id="from" name="from" required>

                    <label class="mt-4" for="to">To:</label>
                    <input class="border border-gray-300 px-2 rounded-sm" v-model="to" type="datetime-local" id="to" name="to" required>
                </div>
            </div>
            <div class="mt-12 text-end space-x-4 md:block">
                <ModalCancelButton :ref="closeBtn" />
                <input type="submit"
                    class="mb-2 inline-block md:mb-0 bg-blue-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-blue-500"
                    :disabled="isLoading" :value="isLoading ? 'Saveing...' : 'Save'">
            </div>
        </form>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import useAuthRequest from '../../../composables/useAuthRequest'
import ModalCancelButton from '../ModalCancelButton.vue'

const props = defineProps({
    taskID: { type: Number, required: true },
})


const { sendAuthRequest } = useAuthRequest()
const from_time = ref()
const to = ref()
const isLoading = ref(false)

const closeBtn = ref(null)


const onSubmit = () => {
    const formData = {
        task: props.taskID,
        from_time: from_time.value,
        to: to.value
    }
    sendAuthRequest({ url: `/calendar/`, method: 'post', data: formData })
        .then((response) => {
            console.log('exported task response = ', response)
            if (response.status === 201) {
                console.log('task was exported successfully !')
                closeBtn.value?.click()
            }
        })
        .catch((err) => console.log('category retrieve err = ', err))
        .finally(() => isLoading.value = false)
}
</script>
