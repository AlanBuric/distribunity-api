<script lang="ts" setup>
  import { RouterView } from 'vue-router';
  import TopBar from '@/components/home/TopBar.vue';
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
    <TopBar class="top-bar" />
    <RouterView :style="{ marginTop: routerViewMarginTop }" />
    <MainFooter class="flex-1 mt-4 w-full" />
  </div>
</template>
