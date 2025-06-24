<script setup lang="ts">
  import ThemeSwitch from '../ThemeSwitch.vue';

  defineProps<{ hasInventories: boolean }>();
</script>

<template>
  <nav
    class="flex items-center justify-between px-4 py-2 bg-transparent bg-white dark:bg-slate-800"
  >
    <div class="flex space-x-3">
      <button
        class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-md px-3 py-1 shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:hover:bg-teal-500"
        @click.prevent="hasInventories && $emit('newItem')"
        :disabled="!hasInventories"
      >
        New item
      </button>
      <form class="space-x-1 max-lg:hidden">
        <input
          name="search"
          placeholder="Search..."
          type="search"
          class="bg-slate-100 dark:bg-slate-700 text-black dark:text-white placeholder-slate-500 appearance-none dark:placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 pl-8 focus:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-active-link"
        />
        <input
          type="submit"
          value="Submit"
          class="bg-slate-100 dark:bg-slate-700 text-black dark:text-white border border-slate-300 dark:border-slate-600 rounded px-2 py-1 dark:hover:text-slate-200 hover:bg-slate-200"
        />
      </form>
    </div>

    <ThemeSwitch />
  </nav>
</template>

<style scoped>
  input[name='search'] {
    background-image: url('/src/assets/search.svg');
    background-position: 5px 3px;
    background-repeat: no-repeat;
  }
</style>
