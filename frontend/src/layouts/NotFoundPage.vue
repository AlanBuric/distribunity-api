<script setup lang="ts">
  import { RouterLink } from 'vue-router';
</script>

<template>
  <main
    class="min-h-screen flex flex-col items-center bg-slate-100 dark:bg-slate-900 text-center px-4"
  >
    <h1 class="text-6xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 mt-[10%]">404</h1>
    <h2 class="text-2xl md:text-4xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
      Oops! Page not found.
    </h2>
    <p class="text-lg text-slate-600 dark:text-slate-400 mb-10">
      The page you're looking for doesn't exist. Let's get you back on track.
    </p>
    <div class="flex items-center space-x-4">
      <RouterLink to="/" class="button-primary">Go home</RouterLink>
      <button
        @click="$router.back()"
        class="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-lg hover:bg-slate-300"
      >
        Go back
      </button>
    </div>
    <p class="mt-10 text-7xl">⛓️‍💥</p>
  </main>
</template>
