<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import HomeFooter from '@/components/home/HomeFooter.vue';
</script>

<template>
  <div class="flex flex-col items-center h-full">
    <RouterView />
    <HomeFooter />
  </div>
</template>
