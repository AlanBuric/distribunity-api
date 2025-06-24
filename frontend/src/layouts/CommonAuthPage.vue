<script setup lang="ts">
  import HomeNavigationBar from '@/components/home/HomeNavigationBar.vue';
  import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex flex-col min-h-dvh w-full">
    <HomeNavigationBar />
    <RouterView />
  </div>
</template>
