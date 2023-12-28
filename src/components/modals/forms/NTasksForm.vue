<template>
    <div class="flex flex-col justify-center items-center z-50 p-4">
        <div class="flex-grow overflow-y-scroll scrolbar-hide">
            <form method="post" @submit.prevent="onSubmit" class="flex flex-col justify-center items-center">
                <h4 class="text-2xl mb-4">How many times do you want to duplicate this task ?</h4>
                <input
                    class="w-1/2 mx-auto my-4 rounded-md bg-light-bg-highlight focus:bg-white p-2 border-0 hover:border-1 hover:border-gray-200 focus:border-gray-200"
                    type="number" name="nTimes" v-model="nTimes" required>
                <div class="w-full mt-6 flex justify-center items-center">
                    <ModalCancelButton />
                    <input type="submit"
                        class="ms-6 mb-2 inline-block md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600"
                        value="Save">
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import ModalCancelButton from '../ModalCancelButton.vue'


const emit = defineEmits(['submit'])
const nTimes = ref()
const onSubmit = () => {
    console.log('nTimes.value =', nTimes.value)
    console.log('isInt =', Number.isInteger(nTimes.value))
    if (nTimes.value && nTimes.value > 0 && Number.isInteger(nTimes.value)) {
        emit('submit', nTimes.value)
    }
}
</script>
