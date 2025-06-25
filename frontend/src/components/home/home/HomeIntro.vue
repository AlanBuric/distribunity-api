<template>
  <section class="bg-cover bg-no-repeat">
    <div
      class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm backdrop-saturate-150 px-5 py-6 max-w-lg md:pb-32 lg:pb-48 xl:pb-72"
    >
      <h2 class="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
        {{ $t('homeIntroTitle') }}
      </h2>
      <p class="text-lg mb-4 text-slate-700 dark:text-slate-300">
        {{ $t('homeIntroDescription') }}
      </p>
      <RouterLink class="inline-block text-lg button-primary" to="/signup">
        {{ $t('homeSignUp') }}
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
  section {
    background: center url('@/assets/inventory-background.webp');
  }
</style>
