<template>
    <button @click="closeModal"
        class="mb-2 md:mb-0 bg-light-bg-secondary dark:bg-dark-bg-secondary px-5 py-2 text-sm font-medium tracking-wider border text-light-text-primary dark:text-dark-text-primary rounded-md hover:shadow-lg">
        Cancel
    </button>
</template>

<script setup>
import { inject } from 'vue'

const closeModal = inject('closeModal')

</script>
