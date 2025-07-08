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
  <div class="w-full flex flex-col min-h-dvh dark:bg-slate-800">
    <HomeNavigationBar />
    <div class="flex-1 flex items-center justify-center -mt-10">
      <form
        @submit.prevent="handleLoginSubmit"
        class="w-full max-w-sm self-center justify-self-center bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 border-1 rounded-md px-8 py-6"
      >
        <h2 class="text-lg font-light text-center mb-6 text-slate-900 dark:text-slate-100">
          {{ t('welcomeBack') }}
        </h2>

        <label for="email" class="block font-semibold text-slate-700 dark:text-slate-300">{{
          t('email')
        }}</label>
        <input
          v-model="email"
          class="w-full my-2 styled-input"
          type="email"
          name="email"
          :placeholder="t('emailPlaceholder')"
          autocomplete="email"
          required
        />

        <label for="password" class="block font-semibold text-slate-700 dark:text-slate-300">{{
          t('password')
        }}</label>
        <input
          v-model="password"
          class="w-full my-2 styled-input"
          type="password"
          name="password"
          :placeholder="t('passwordPlaceholder')"
          autocomplete="current-password"
          required
        />

        <button
          type="submit"
          value="Log in"
          class="button-primary w-full mt-8"
          :disabled="isWaitingForResponse"
        >
          {{ t('signIn') }}
        </button>
        <div class="w-full flex justify-center mt-1">
          <RouterLink
            to="/signup"
            class="text-center text-slate-700 dark:text-slate-300 underline"
            >{{ t('createAccount') }}</RouterLink
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
    "signUp": "Sign up",
    "welcomeBack": "Welcome back!",
    "email": "Email:",
    "emailPlaceholder": "e.g. john.smith{'@'}gmail.com",
    "password": "Password:",
    "passwordPlaceholder": "Your password",
    "createAccount": "Create account",
    "loginErrorUnknown": "Unknown error",
    "loginErrorInvalid": "Invalid email or password.",
    "loginErrorNetwork": "Network error. Please try again.",
    "loginErrorRequired": "Email and password are required."
  },
  "hr-HR": {
    "signIn": "Prijavi me",
    "signUp": "Učlani me",
    "welcomeBack": "Dobrodošli natrag!",
    "email": "E-mail:",
    "emailPlaceholder": "npr. ana.novak{'@'}gmail.com",
    "password": "Lozinka:",
    "passwordPlaceholder": "Vaša lozinka",
    "createAccount": "Stvori račun",
    "loginErrorUnknown": "Nepoznata greška",
    "loginErrorInvalid": "Neispravan e-mail ili lozinka.",
    "loginErrorNetwork": "Greška u mreži. Pokušajte ponovno.",
    "loginErrorRequired": "E-mail i lozinka su obavezni."
  },
  "it-IT": {
    "signIn": "Accedi",
    "signUp": "Registrati",
    "welcomeBack": "Bentornato!",
    "email": "Email:",
    "emailPlaceholder": "es. amelia.rossi{'@'}gmail.com",
    "password": "Password:",
    "passwordPlaceholder": "La tua password",
    "createAccount": "Crea account",
    "loginErrorUnknown": "Errore sconosciuto",
    "loginErrorInvalid": "Email o password non validi.",
    "loginErrorNetwork": "Errore di rete. Riprova.",
    "loginErrorRequired": "Email e password sono obbligatori."
  }
}
</i18n>
