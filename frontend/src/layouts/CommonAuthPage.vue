<script setup lang="ts">
  import NavigationBar from '@/components/home/NavigationBar.vue';
  import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-initial shadow-md z-10 flex justify-center w-full bg-white dark:bg-gray-800">
      <NavigationBar class="max-w-screen-2xl w-full" />
    </div>
    <RouterView />
  </div>
</template>
