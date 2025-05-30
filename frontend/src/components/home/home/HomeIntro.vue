<template>
  <section class="bg-cover bg-center bg-no-repeat">
    <div class="bg-white bg-opacity-80 backdrop-blur-sm px-5 py-6 max-w-lg md:pb-32 lg:pb-48 xl:pb-72 dark:bg-gray-800 dark:bg-opacity-80">
      <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        It's time to ditch the spreadsheets and pen & paper.
      </h2>
      <p class="text-xl mb-4 text-gray-700 dark:text-gray-300">
        <b>Distribunity</b> takes care of all the inventory changes, details and item tracking of your business in one place.
      </p>
      <RouterLink
        class="inline-block text-lg fancy-button"
        to="/signup"
      >
        Sign up for free
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
  section {
    background: center url('@/assets/inventory-background.webp');
  }
</style>
