<script lang="ts" setup>
  import HomeIntro from '@/components/home/home/HomeIntro.vue';
  import ComingSoon from '@/components/home/home/ComingSoon.vue';
  import SolutionInfo from '@/components/home/home/SolutionInfo.vue';
  import FAQOffer from '@/components/home/home/FAQOffer.vue';
  import NewsletterForm from '@/components/home/home/NewsletterForm.vue';
</script>

<template>
  <main class="flex flex-col gap-5 max-w-screen-2xl w-full">
    <HomeIntro class="bg-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 2xl:rounded-xl" />
    <SolutionInfo class="bg-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 2xl:rounded-xl" />
    <ComingSoon class="bg-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 2xl:rounded-xl" />
    <NewsletterForm class="bg-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 2xl:rounded-xl" />
    <FAQOffer class="bg-gray-100 shadow-sm overflow-hidden dark:bg-gray-800 2xl:rounded-xl" />
  </main>
</template>
