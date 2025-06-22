<script lang="ts" setup>
  import HomeIntro from '@/components/home/home/HomeIntro.vue';
  import ComingSoon from '@/components/home/home/ComingSoon.vue';
  import SolutionInfo from '@/components/home/home/SolutionInfo.vue';
  import FAQOffer from '@/components/home/home/FAQOffer.vue';
  import NewsletterForm from '@/components/home/home/NewsletterForm.vue';
</script>

<template>
  <main class="flex flex-col gap-5 max-w-screen-xl w-full">
    <HomeIntro class="overflow-hidden border-gray-300 dark:border-gray-700 border-1 rounded-md" />
    <SolutionInfo
      class="bg-white overflow-hidden dark:bg-gray-900 border-gray-300 dark:border-gray-700 border-1 rounded-md"
    />
    <ComingSoon
      class="bg-white overflow-hidden dark:bg-gray-900 border-gray-300 dark:border-gray-700 border-1 rounded-md"
    />
    <NewsletterForm
      class="bg-white overflow-hidden dark:bg-gray-900 border-gray-300 dark:border-gray-700 border-1 rounded-md"
    />
    <FAQOffer
      class="bg-white overflow-hidden dark:bg-gray-900 border-gray-300 dark:border-gray-700 border-1 rounded-md"
    />
  </main>
</template>
