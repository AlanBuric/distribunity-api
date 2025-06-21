<script lang="ts" setup>
  import NavHeader from './NavHeader.vue';
  import NavigationBar from './NavigationBar.vue';
</script>

<template>
  <div
    role="banner"
    class="bg-white dark:bg-gray-800 fixed w-full flex justify-center shadow-md z-50 py-2 px-4 text-sm"
  >
    <div class="max-w-screen-2xl w-full flex flex-wrap items-center">
      <NavHeader />
      <NavigationBar />
    </div>
  </div>
</template>
