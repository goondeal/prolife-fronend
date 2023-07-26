<template>
    <div class="flex w-full h-full">
        <SideMenu />
        <main class="w-full h-full">
            <slot />
        </main>
    </div>
</template>

<script setup>
import SideMenu from '@/components/sidebar/SideMenu.vue';
</script>

<style>
html,body, #app, #__layout{
  height:100%!important;
  width: 100%!important;
}
</style>