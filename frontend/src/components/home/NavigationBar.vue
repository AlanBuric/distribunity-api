<script lang="ts" setup>
  import { auth } from '@/firebase/init';
  import ThemeSwitch from '../ThemeSwitch.vue';
  import { useRouter } from 'vue-router';

  defineProps<{ hideBlog?: boolean }>();

  const router = useRouter();

  function logoutAndRefresh() {
    auth.signOut().finally(() => router.go(0));
  }
</script>

<template>
  <nav class="flex flex-1 flex-wrap items-center justify-between px-4 py-2 bg-white dark:bg-gray-800">
    <div class="flex items-center gap-3">
      <RouterLink
        class="text-lg font-medium text-gray-700 dark:text-gray-300 dark:hover:text-active-link"
        to="/"
        exact
      >
        Home
      </RouterLink>
      <RouterLink
        class="text-lg font-medium text-gray-700 dark:text-gray-300 dark:hover:text-active-link"
        to="/resources"
      >
        Resources
      </RouterLink>
      <RouterLink
        v-if="!hideBlog"
        class="text-lg font-medium text-gray-700 dark:text-gray-300 dark:hover:text-active-link"
        :to="{ name: 'blog', query: { page: 1 } }"
      >
        Blog
      </RouterLink>
    </div>

    <div class="flex items-center gap-3">
      <form class="space-x-1 max-lg:hidden">
        <input
          name="search"
          placeholder="Search..."
          type="search"
          class="bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 appearance-none dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pl-8 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-active-link"
        >
        <input
          type="submit"
          value="Submit"
          class="bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:hover:text-gray-200 hover:bg-gray-200"
        >
      </form>

      <template v-if="!auth.currentUser">
        <RouterLink
          class="text-lg font-medium text-gray-700 dark:text-gray-300 dark:hover:text-active-link"
          to="/login"
        >
          Log in
        </RouterLink>
        <RouterLink
          class="text-lg font-medium text-gray-700 dark:text-gray-300 dark:hover:text-active-link"
          to="/signup"
        >
          Sign up
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink
          class="text-lg font-medium text-gray-700 dark:text-gray-300 dark:hover:text-active-link"
          to="/work"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          class="text-lg font-medium text-gray-700 dark:text-gray-300 dark:hover:text-active-link"
          to="/work/settings"
        >
          Settings
        </RouterLink>
        <button
          class="text-lg font-medium text-gray-700 dark:text-gray-300 dark:hover:text-active-link"
          @click.prevent="logoutAndRefresh()"
        >
          Sign out
        </button>
      </template>

      <ThemeSwitch />
    </div>
  </nav>
</template>

<style scoped>
  input[name=search] {
    background-image: url('/src/assets/search.svg');
    background-position: 5px 3px;
    background-repeat: no-repeat;
  }

  .router-link-exact-active {
    color: var(--active-link);
  }
</style>
