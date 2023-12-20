<template>
    <div id="modal-wrapper" class="fixed top-0 left-0 flex justify-center items-center overflow-auto w-full h-full bg-dark-bg-primary dark:bg-light-bg-primary bg-opacity-70 z-40">
         <div class="p-3 rounded-xl shadow-lg z-50 bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary">
             <slot  />
        </div> 
    </div>
</template>


<script setup>
import { defineEmits, provide } from 'vue'

const emit = defineEmits(['closeModal'])
const close = () => emit('closeModal')
provide('closeModal', close)

window.addEventListener('click', (event) => {
    var modal = document.getElementById("modal-wrapper")
    if (modal && event.target == modal) {
        emit('closeModal')
    }
})

</script>
