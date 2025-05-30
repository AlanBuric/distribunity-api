<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  // TODO: add random fun facts at the bottom.
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
    <h1 class="text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
      404
    </h1>
    <h2 class="text-2xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
      Oops! Page not found.
    </h2>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-10">
      The page you're looking for doesn't exist. Let's get you back on track.
    </p>
    <div class="flex space-x-4">
      <RouterLink
        to="/"
        class="fancy-button"
      >
        Go Home
      </RouterLink>
      <button
        @click="$router.back()"
        class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-md transition-transform transform hover:scale-105"
      >
        Go Back
      </button>
    </div>
    <p class="mt-10 text-7xl">
      ⛓️‍💥
    </p>
  </main>
</template>
