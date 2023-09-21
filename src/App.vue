<template>
  <component :class="{ 'dark': darkMode }" :is="$route.meta.layout || 'div' ">
    <div class="w-full h-full text-light-text-primary bg-light-bg-primary dark:bg-dark-bg-primary dark:text-dark-text-primary">
      <RouterView />
    </div>
  </component>
</template>


<script setup>
import { onBeforeMount, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
onBeforeMount(() => userStore.initStore())

const darkMode = ref(false)
</script>
