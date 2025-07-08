<script lang="ts" setup>
  import Logo from '../icons/BrandLogo.vue';
  import useAuthStore from '@/store/auth';
  import ThemeSwitch from '@/components/ThemeSwitch.vue';
  import LanguageSwitch from '@/components/LanguageSwitch.vue';
  import { useRouter } from 'vue-router';
  import { AuthState } from '@/types';

  defineProps<{ hideBlog?: boolean }>();

  const auth = useAuthStore();
  const router = useRouter();

  function logoutAndRefresh() {
    auth.signOut().finally(() => router.go(0));
  }
</script>

<template>
  <div
    role="banner"
    class="backdrop-blur-lg backdrop-saturate-150 border-b-1 border-b-black/10 bg-white/60 dark:bg-slate-800/60 sticky w-full top-0 mb-12 flex flex-wrap justify-center shadow-md z-30 py-2 px-4 text-sm"
  >
    <div class="flex w-full max-w-screen-2xl justify-between">
      <RouterLink to="/" class="w-fit">
        <header class="flex gap-x-2 rounded">
          <Logo width="3rem" />
          <div class="flex flex-col justify-center">
            <h1 class="text-2xl font-semibold font-serif text-slate-900 dark:text-slate-100">
              Distribunity
            </h1>
            <p
              id="title-quote"
              class="text-xs md:text-sm font-light text-slate-700 dark:text-slate-300"
            >
              Inventory management done right.
            </p>
          </div>
        </header>
      </RouterLink>
      <div class="flex items-center gap-3">
        <RouterLink
          class="text-lg font-light text-slate-700 dark:text-slate-300 hover:text-active-link dark:hover:text-active-link"
          to="/"
          exact
        >
          {{ $t('home') }}
        </RouterLink>
        <RouterLink
          class="text-lg font-light text-slate-700 dark:text-slate-300 hover:text-active-link dark:hover:text-active-link"
          to="/resources"
        >
          {{ $t('resources') }}
        </RouterLink>
        <RouterLink
          v-if="!hideBlog"
          class="text-lg font-light text-slate-700 dark:text-slate-300 hover:text-active-link dark:hover:text-active-link"
          :to="{ name: 'blog', query: { page: 1 } }"
        >
          {{ $t('blog') }}
        </RouterLink>

        <template v-if="auth.state == AuthState.LoggedOut">
          <RouterLink
            class="text-lg font-light text-slate-700 dark:text-slate-300 hover:text-active-link dark:hover:text-active-link"
            to="/login"
          >
            {{ $t('logIn') }}
          </RouterLink>
          <RouterLink
            class="text-lg font-light text-slate-700 dark:text-slate-300 hover:text-active-link dark:hover:text-active-link"
            to="/signup"
          >
            {{ $t('signUp') }}
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink
            class="text-lg font-light text-slate-700 dark:text-slate-300 hover:text-active-link dark:hover:text-active-link"
            to="/work"
          >
            {{ $t('dashboard') }}
          </RouterLink>
          <RouterLink
            class="text-lg font-light text-slate-700 dark:text-slate-300 hover:text-active-link dark:hover:text-active-link"
            to="/work/settings"
          >
            {{ $t('settings') }}
          </RouterLink>
          <button
            class="text-lg font-light text-slate-700 dark:text-slate-300 hover:text-active-link dark:hover:text-active-link"
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
  .router-link-exact-active {
    color: var(--color-active-link);
  }
</style>
