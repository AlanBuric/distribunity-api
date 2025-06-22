<template>
  <section class="bg-cover bg-center bg-no-repeat">
    <div
      class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-5 py-6 max-w-lg md:pb-32 lg:pb-48 xl:pb-72"
    >
      <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {{ $t('homeIntroTitle') }}
      </h2>
      <p class="text-xl mb-4 text-gray-700 dark:text-gray-300">
        {{ $t('homeIntroDescription') }}
      </p>
      <RouterLink class="inline-block text-lg fancy-button" to="/signup">
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
