<script lang="ts" setup>
  import { watch } from 'vue';
  import { RouterView, useRoute, useRouter } from 'vue-router';
  import useAuthStore from './store/auth';
  import { AuthState } from './types';
  import { storeToRefs } from 'pinia';

  const { user, state } = storeToRefs(useAuthStore());
  const router = useRouter();
  const route = useRoute();

  watch(user, async () => {
    if (state.value == AuthState.LoggedOut && route.meta.requiresAuth)
      return router.push({ name: 'login', replace: true });

    if (state.value == AuthState.LoggedIn && typeof route.query.redirect === 'string')
      return router.push(route.query.redirect);
  });
</script>

<template>
  <Suspense>
    <RouterView />

    <template #fallback>
      <p class="text-white text-semibold text-center">Loading...</p>
    </template>
  </Suspense>
</template>
