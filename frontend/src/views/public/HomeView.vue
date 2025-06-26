<script lang="ts" setup>
  import HomeIntro from '@/components/home/home/HomeIntro.vue';
  import SolutionInfo from '@/components/home/home/SolutionInfo.vue';
  import FAQOffer from '@/components/home/home/FAQOffer.vue';
  import NewsletterForm from '@/components/home/home/NewsletterForm.vue';
  import HomeNavigationBar from '@/components/home/HomeNavigationBar.vue';
  import FeaturesInfo from '@/components/home/home/FeaturesInfo.vue';
</script>

<template>
  <div
    class="flex flex-col items-center h-full w-full bg-no-repeat bg-radial-[at_50%_0%] from-blue-300 dark:from-blue-400 via-sky-200 to-slate-50 dark:via-blue-950 dark:to-slate-900 to-70% dark:bg-slate-900"
  >
    <HomeNavigationBar id="top-bar" />
    <main class="flex flex-col gap-20 max-w-screen-2xl w-full">
      <HomeIntro />
      <div class="flex gap-6">
        <SolutionInfo />
        <NewsletterForm />
      </div>
      <FeaturesInfo />
      <FAQOffer />
    </main>
  </div>
</template>
