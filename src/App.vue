<template>
  <component :is="$route.meta.layout || 'div' ">
    <RouterView />
  </component>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
onBeforeMount(() => userStore.initStore())

</script>

