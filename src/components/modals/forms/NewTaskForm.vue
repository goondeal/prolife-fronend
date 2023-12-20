<template>
    <div class="h-screen w-3/5 z-50 p-8">
        <form method="post" @submit.prevent="onSubmit">
            <input class="p-2 text-4xl font-bold border-0 focus:border-0 placeholder:font-bold placeholder:text-4xl" v-model="task.name" type="text" name="name" placeholder="Untitled" required>
        </form>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
    columns: { type: Array, required: true }
})
const task = ref({name: ''})

const onSubmit = () => {

}
</script>
