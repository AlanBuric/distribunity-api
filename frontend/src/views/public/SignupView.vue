<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { getPasswordStrength, type PasswordStrength } from '@/scripts/password-policy';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import HomeNavigationBar from '@/components/home/HomeNavigationBar.vue';

  type LoginStateMessage = {
    message: string;
    state: 'processing' | 'success' | 'failure';
  };
  type PasswordsMatchState = {
    feedback: string;
    classList: string;
    matches: boolean;
  };

  const router = useRouter();

  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const passwordStrength = ref<PasswordStrength>(getPasswordStrength('a'));
  const passwordsMatch = ref<PasswordsMatchState | undefined>();
  const loginStateMessage = ref<LoginStateMessage>();
  const formIssues = ref<string[]>([]);

  watch(password, (newPassword) => {
    passwordStrength.value = getPasswordStrength(newPassword);
  });

  watch([password, confirmPassword], ([newPassword, newConfirmPassword]) => {
    const matches = newPassword == newConfirmPassword;

    if (newPassword == newConfirmPassword) {
      passwordsMatch.value = {
        feedback: 'Passwords match.',
        classList: 'text-green-400',
        matches,
      };
    } else {
      passwordsMatch.value = {
        feedback: "Confirmation password doesn't match the password.",
        classList: 'text-red-400',
        matches,
      };
    }
  });

  function getFormValidityIssues() {
    const issues: string[] = [];

    if (passwordStrength.value.strength <= 2) {
      issues.push(
        'Your password is too weak. Use lowercase and uppercase letters, numbers and symbols',
      );
    }

    if (password.value.length < 6) {
      issues.push('Your password is too short, it needs to be at least 6 characters long');
    }

    if (!passwordsMatch.value?.matches) {
      issues.push("Your passwords don't match");
    }

    return issues;
  }

  function isAllowedToSubmit() {
    return (
      formIssues.value.length == 0 &&
      passwordsMatch.value &&
      loginStateMessage.value?.state != 'processing'
    );
  }

  function handleUserRegistrationError(error: any) {
    if (error.code == 'auth/email-already-in-use') {
      loginStateMessage.value = {
        message: `The email ${email.value} is already in use.`,
        state: 'failure',
      };
    } else {
      loginStateMessage.value = {
        message:
          'Sorry, but we failed to create your user profile in our database. Please contact us for support; you can find our contacts at the bottom of the page.',
        state: 'failure',
      };
    }
  }

  async function handleUserRegistration() {
    formIssues.value = getFormValidityIssues();

    if (formIssues.value.length == 0) {
      loginStateMessage.value = {
        message: 'Creating your account...',
        state: 'processing',
      };

      try {
        await axios.post('/api/register', { email: email.value, password: password.value });

        loginStateMessage.value = {
          message: 'Your account has been successfully created.',
          state: 'success',
        };

        router.push({ path: '/login' });
      } catch (error) {
        handleUserRegistrationError(error);
      }
    }
  }
</script>

<template>
  <div class="w-full flex flex-col min-h-dvh dark:bg-slate-800">
    <HomeNavigationBar />
    <div class="flex-1 flex items-center justify-center -mt-8">
      <form
        @submit.prevent="handleUserRegistration"
        class="w-full max-w-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 border-1 rounded-md px-8 py-6"
      >
        <h2 class="text-3xl font-light text-center mb-6 text-slate-900 dark:text-slate-100">
          Create an account
        </h2>

        <label for="firstName" class="block font-semibold text-slate-700 dark:text-slate-300">
          First name:
        </label>
        <input
          v-model="firstName"
          class="w-full my-2 styled-input"
          type="text"
          name="firstName"
          minlength="2"
          maxlength="40"
          placeholder="e.g. Amelia"
          autocomplete="given-name"
          required
        />

        <label for="lastName" class="block font-semibold text-slate-700 dark:text-slate-300">
          Last name:
        </label>
        <input
          v-model="lastName"
          class="w-full my-2 styled-input"
          type="text"
          name="lastName"
          minlength="2"
          maxlength="40"
          placeholder="e.g. Wilson"
          autocomplete="family-name"
        />

        <label for="email" class="block font-semibold text-slate-700 dark:text-slate-300">
          Email:
        </label>
        <input
          v-model="email"
          class="w-full my-2 styled-input"
          type="email"
          name="email"
          placeholder="e.g. amelia.wilson@gmail.com"
          autocomplete="email"
          required
        />

        <label for="password" class="block font-semibold text-slate-700 dark:text-slate-300">
          Password:
        </label>
        <input
          v-model="password"
          class="w-full my-2 styled-input"
          type="password"
          name="password"
          minlength="6"
          placeholder="New password"
          autocomplete="new-password"
          required
        />

        <p id="password-strength" class="mb-4 text-slate-600 dark:text-slate-400">
          Password strength:
          <span class="font-light text-slate-700 dark:text-slate-100">{{
            passwordStrength.title
          }}</span>
        </p>

        <label
          for="password-confirm"
          class="block font-semibold text-slate-700 dark:text-slate-300"
        >
          Confirm password:
        </label>
        <input
          id="password-confirm"
          v-model="confirmPassword"
          class="w-full my-2 styled-input"
          type="password"
          name="password-confirm"
          placeholder="Confirm password"
          autocomplete="off"
          required
        />
        <p v-if="passwordsMatch" :class="['mb-4', passwordsMatch.classList]">
          {{ passwordsMatch.feedback }}
        </p>

        <input
          type="submit"
          value="Sign up"
          class="button-primary w-full mt-8"
          :disabled="!isAllowedToSubmit()"
        />

        <p
          v-if="loginStateMessage"
          :class="{
            'mt-4': true,
            'text-yellow-400': loginStateMessage.state == 'processing',
            'text-green-400': loginStateMessage.state == 'success',
            'text-red-400': loginStateMessage.state == 'failure',
          }"
        >
          {{ loginStateMessage.message }}
        </p>
        <ul v-else-if="!formIssues.length" class="mt-4 text-red-600">
          <li v-for="(issue, index) in formIssues" :key="index">
            {{ issue }}
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>
