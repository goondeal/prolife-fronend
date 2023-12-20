<template>
    <div>
        <form method="post" @submit.prevent="onSubmit">
            <div class="p-3 flex-auto text-center justify-center items-center leading-6">
                <input type="search" class="w-full">
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

import { ref } from 'vue'

const isLoading = ref(false)

</script>
