<script lang="ts" setup>
  import Logo from '../icons/BrandLogo.vue';
  import useAuthStore from '@/store/auth';
  import ThemeSwitch from '@/components/ThemeSwitch.vue';
  import LanguageSwitch from '@/components/LanguageSwitch.vue';
  import { useRouter } from 'vue-router';
  import { AuthState } from '@/types';
  import { ref } from 'vue';

  defineProps<{ hideBlog?: boolean }>();

  const auth = useAuthStore();
  const router = useRouter();

  function logoutAndRefresh() {
    auth.signOut().finally(() => router.go(0));
  }

  const searchValue = ref<string>('');
</script>

<template>
  <div
    role="banner"
    class="backdrop-blur-lg backdrop-saturate-150 border-b-1 border-b-black/10 bg-white/60 dark:bg-gray-800/60 sticky w-full top-0 mb-12 flex flex-wrap justify-center shadow-md z-30 py-2 px-4 text-sm"
  >
    <div class="flex w-full max-w-screen-2xl justify-between">
      <RouterLink to="/" class="w-fit">
        <header class="flex gap-x-2 rounded">
          <Logo width="3rem" />
          <div class="flex flex-col justify-center">
            <h1 class="text-2xl font-semibold font-serif text-gray-900 dark:text-gray-100">
              Distribunity
            </h1>
            <p
              id="title-quote"
              class="text-xs md:text-sm font-light text-gray-700 dark:text-gray-300"
            >
              Inventory management done right.
            </p>
          </div>
        </header>
      </RouterLink>
      <div class="flex items-center gap-3">
        <RouterLink
          class="text-lg font-light text-gray-700 dark:text-gray-300 hover:text-active-link dark:hover:text-active-link"
          to="/"
          exact
        >
          {{ $t('home') }}
        </RouterLink>
        <RouterLink
          class="text-lg font-light text-gray-700 dark:text-gray-300 hover:text-active-link dark:hover:text-active-link"
          to="/resources"
        >
          {{ $t('resources') }}
        </RouterLink>
        <RouterLink
          v-if="!hideBlog"
          class="text-lg font-light text-gray-700 dark:text-gray-300 hover:text-active-link dark:hover:text-active-link"
          :to="{ name: 'blog', query: { page: 1 } }"
        >
          {{ $t('blog') }}
        </RouterLink>
      </div>
      <div class="flex items-center gap-3">
        <input
          name="search"
          placeholder="Search..."
          type="search"
          :value="searchValue"
          class="max-w-36 max-lg:hidden bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 appearance-none dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pl-8 focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-active-link"
        />

        <template v-if="auth.state == AuthState.LoggedOut">
          <RouterLink
            class="text-lg font-light text-gray-700 dark:text-gray-300 hover:text-active-link dark:hover:text-active-link"
            to="/login"
          >
            {{ $t('logIn') }}
          </RouterLink>
          <RouterLink
            class="text-lg font-light text-gray-700 dark:text-gray-300 hover:text-active-link dark:hover:text-active-link"
            to="/signup"
          >
            {{ $t('signUp') }}
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink
            class="text-lg font-light text-gray-700 dark:text-gray-300 hover:text-active-link dark:hover:text-active-link"
            to="/work"
          >
            {{ $t('dashboard') }}
          </RouterLink>
          <RouterLink
            class="text-lg font-light text-gray-700 dark:text-gray-300 hover:text-active-link dark:hover:text-active-link"
            to="/work/settings"
          >
            {{ $t('settings') }}
          </RouterLink>
          <button
            class="text-lg font-light text-gray-700 dark:text-gray-300 hover:text-active-link dark:hover:text-active-link"
            @click.prevent="logoutAndRefresh()"
          >
            {{ $t('signOut') }}
          </button>
        </template>

        <LanguageSwitch />
        <ThemeSwitch />
      </div>
    </div>
  </div>
</template>
ks
<style scoped>
  input[name='search'] {
    background-image: url('/src/assets/search.svg');
    background-position: 5px 3px;
    background-repeat: no-repeat;
  }

  .router-link-exact-active {
    color: var(--color-active-link);
  }
</style>
