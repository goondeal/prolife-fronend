<template>
    <div class="flex flex-col max-w-sm me-4 my-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <RouterLink :to="props.href">
            <div class="w-full h-[300px]">
                <img class="rounded-t-lg w-full h-full" :src="props.data.img" :alt="props.data.name" />
            </div>
        </RouterLink>
        <div class="p-4 flex-grow flex flex-col items-start justify-between">
            <div class="flex items-start justify-start">
                <RouterLink :to="props.href" class="flex items-start justify-start">
                    <div class="w-4 h-4 mt-[8px] rounded-full" :style="{backgroundColor: props.data.color}"></div>
                    <h5 class="mx-2 text-2xl font-bold hover:underline tracking-tight text-gray-900 dark:text-white">
                        {{ props.data.name }}
                    </h5>
                </RouterLink>
                <StarIcon v-if="props.data.is_featured" class="w-8 h-8 ms-2 text-yellow-400"></StarIcon>
            </div>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">#projects:  {{props.data.projects_count}}</p>
            <a href="#"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                open
                <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
            </a>
        </div>
    </div>
</template>


<script setup>
import { defineProps } from 'vue'
import { StarIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    data: { type: Object, required: true },
    href: { type: Object, required: true }
})


</script>
