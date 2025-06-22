<script lang="ts" setup>
  import HomeNavLogo from './HomeNavLogo.vue';
  import NavigationBar from './NavigationBar.vue';
</script>

<template>
  <div
    role="banner"
    class="topbar-glass bg-white/60 dark:bg-gray-800/60 fixed w-full flex justify-center shadow-md z-50 py-2 px-4 text-sm"
  >
    <div class="max-w-screen-xl w-full flex flex-wrap items-center">
      <HomeNavLogo />
      <NavigationBar />
    </div>
  </div>
</template>
ks
<style scoped>
  .topbar-glass {
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(7px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>
