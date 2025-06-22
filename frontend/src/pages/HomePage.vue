<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import HomeNavigationBar from '@/components/home/HomeNavigationBar.vue';
  import MainFooter from '@/components/home/MainFooter.vue';
  import { onMounted, onUnmounted, ref } from 'vue';

  const routerViewMarginTop = ref('0px');

  const setTopMargin = () => {
    const topBarElement = document.querySelector('.top-bar') as HTMLElement | null;

    if (topBarElement) {
      const topBarHeight = topBarElement.offsetHeight;
      routerViewMarginTop.value = `${topBarHeight + 20}px`;
    }
  };

  onMounted(() => {
    setTopMargin();
    window.addEventListener('resize', setTopMargin);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', setTopMargin);
  });
</script>

<template>
  <div class="flex flex-col items-center h-full">
    <HomeNavigationBar class="top-bar" />
    <RouterView :style="{ marginTop: routerViewMarginTop }" />
    <MainFooter class="flex-1 mt-4 w-full" />
  </div>
</template>
