<script lang="ts" setup>
  import HomeIntro from '@/components/home/home/HomeIntro.vue';
  import ComingSoon from '@/components/home/home/ComingSoon.vue';
  import SolutionInfo from '@/components/home/home/SolutionInfo.vue';
  import FAQOffer from '@/components/home/home/FAQOffer.vue';
  import NewsletterForm from '@/components/home/home/NewsletterForm.vue';
  import HomeNavigationBar from '@/components/home/HomeNavigationBar.vue';
</script>

<template>
  <div
    class="flex flex-col items-center h-full w-full bg-no-repeat bg-radial-[at_50%_0%] from-blue-300 dark:from-blue-400 via-sky-200 to-slate-50 dark:via-blue-950 dark:to-slate-800 to-80% dark:bg-slate-800"
  >
    <HomeNavigationBar id="top-bar" />
    <main class="flex flex-col gap-5 max-w-screen-2xl w-full">
      <HomeIntro
        class="overflow-hidden border-slate-300 dark:border-slate-700 border-1 rounded-md"
      />
      <SolutionInfo
        class="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 border-1 rounded-md"
      />
      <ComingSoon
        class="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 border-1 rounded-md"
      />
      <NewsletterForm
        class="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 border-1 rounded-md"
      />
      <FAQOffer
        class="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 border-1 rounded-md"
      />
    </main>
  </div>
</template>
