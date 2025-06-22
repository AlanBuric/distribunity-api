<script setup lang="ts">
  import MoonIcon from './icons/MoonIcon.vue';
  import SunIcon from './icons/SunIcon.vue';
  import useGlobalStore from '@/store/global';

  const store = useGlobalStore();
</script>

<template>
  <button
    @click="store.nextTheme"
    class="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
  >
    <MoonIcon v-if="store.theme == 'dark'" class="w-5 h-5 fill-gray-300" />
    <SunIcon v-else class="w-5 h-5 fill-gray-800" />
  </button>
</template>
