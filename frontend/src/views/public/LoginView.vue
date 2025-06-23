<script lang="ts" setup>
  import HomeNavigationBar from '@/components/home/HomeNavigationBar.vue';
  import useAuthStore from '@/store/auth';
  import { AxiosError } from 'axios';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter, RouterLink } from 'vue-router';

  const router = useRouter();
  const { t } = useI18n();

  const email = ref('');
  const password = ref('');
  const loginError = ref<string>();
  const isWaitingForResponse = ref(false);

  function handleLoginSubmit() {
    loginError.value = undefined;

    useAuthStore()
      .logIn(email.value, password.value)
      .then(() => router.push('/work'))
      .catch((error: AxiosError) => {
        loginError.value = (error.response?.data as string) ?? 'Unknown error';
      });
  }
</script>

<template>
  <div class="w-full flex flex-col min-h-dvh dark:bg-gray-800">
    <HomeNavigationBar />
    <div class="flex-1 flex items-center justify-center">
      <form
        @submit.prevent="handleLoginSubmit"
        class="w-full max-w-sm self-center justify-self-center bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 border-1 rounded-md px-8 py-6"
      >
        <h2 class="text-lg font-light text-center mb-6 text-gray-900 dark:text-gray-100">
          Welcome back!
        </h2>

        <label for="email" class="block font-semibold text-gray-700 dark:text-gray-300"
          >Email:</label
        >
        <input
          v-model="email"
          class="w-full px-2 py-2 mt-2 mb-2 border rounded-lg focus:ring-2 focus:ring-active-link focus:outline-none bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          type="email"
          name="email"
          placeholder="e.g. amelia.wilson@gmail.com"
          autocomplete="email"
          required
        />

        <label for="password" class="block font-semibold text-gray-700 dark:text-gray-300"
          >Password:</label
        >
        <input
          v-model="password"
          class="w-full px-2 py-2 mt-2 mb-6 border rounded-lg focus:ring-2 focus:ring-active-link focus:outline-none bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          type="password"
          name="password"
          placeholder="Your password"
          autocomplete="current-password"
          required
        />

        <button
          type="submit"
          value="Log in"
          class="fancy-button w-full"
          :disabled="isWaitingForResponse"
        >
          {{ t('signIn') }}
        </button>
        <div class="w-full flex justify-center mt-1">
          <RouterLink to="/signup" class="text-center text-white dark:text-gray-300 underline"
            >Create account</RouterLink
          >
        </div>

        <p v-if="loginError" class="mt-4 text-red-600">
          {{ loginError }}
        </p>
      </form>
    </div>
  </div>
</template>

<style lang="css">
  input:-webkit-autofill,
  input:-webkit-autofill:focus {
    transition:
      background-color 0s 600000s,
      color 0s 600000s !important;
  }
</style>

<i18n>
{
  "en-US": {
    "signIn": "Sign in",
    "signUp": "Sign up"
  },
  "hr-HR": {
    "signIn": "Prijavi me",
    "signUp": "Učlani me"
  }
}
</i18n>
