<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { getPasswordStrength, type PasswordStrength } from '@/scripts/password-policy';
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { auth, database } from '@/firebase/init';
  import { setDoc, doc } from 'firebase/firestore';
  import { useRouter } from 'vue-router';

  type LoginStateMessage = {
    message: string
    state: 'processing' | 'success' | 'failure'
  };
  type PasswordsMatchState = {
    feedback: string
    classList: string
    matches: boolean
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
        feedback: 'Confirmation password doesn\'t match the password.',
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
      issues.push('Your passwords don\'t match');
    }

    return issues;
  }

  function isAllowedToSubmit() {
    return formIssues.value.length == 0 && passwordsMatch.value && loginStateMessage.value?.state != 'processing';
  }

  function handleUserRegistrationError(error: any) {
    if (error.code == 'auth/email-already-in-use') {
      loginStateMessage.value = {
        message: `The email ${email.value} is already in use.`,
        state: 'failure',
      };
    } else {
      loginStateMessage.value = {
        message: 'Sorry, but we failed to create your user profile in our database. Please contact us for support; you can find our contacts at the bottom of the page.',
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
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);

        loginStateMessage.value.message = 'User creation succeeded.';

        await setDoc(doc(database, 'users', userCredential.user.uid), {
          firstName: firstName.value,
          lastName: lastName.value,
          theme: 'dark',
          language: 'en_us',
          organizations: [],
          joined: Date.now(),
        });

        loginStateMessage.value = {
          message: 'Your user profile is ready. If you\'re still seeing this message, refresh the page and visit the Dashboard.',
          state: 'success',
        };

        await updateProfile(userCredential.user, {
          displayName: `${firstName.value} ${lastName.value}`,
        }).catch(console.error);

        router.push({ path: '/work' });
      } catch (error) {
        handleUserRegistrationError(error);
      }
    }
  }
</script>

<template>
  <form @submit.prevent="handleUserRegistration" class="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
    <h2 class="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
      Create an account
    </h2>

    <label for="firstName" class="block text-lg font-medium text-gray-700 dark:text-gray-300">
      First name:
    </label>
    <input
      v-model="firstName"
      class="w-full p-2 mt-2 mb-4 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      type="text"
      name="firstName"
      minlength="2"
      maxlength="40"
      placeholder="e.g. Amelia"
      autocomplete="given-name"
      required
    >

    <label for="lastName" class="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Last name:
    </label>
    <input
      v-model="lastName"
      class="w-full p-2 mt-2 mb-4 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      type="text"
      name="lastName"
      minlength="2"
      maxlength="40"
      placeholder="e.g. Wilson"
      autocomplete="family-name"
    >

    <label for="email" class="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Email:
    </label>
    <input
      v-model="email"
      class="w-full p-2 mt-2 mb-4 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      type="email"
      name="email"
      placeholder="e.g. amelia.wilson@gmail.com"
      autocomplete="email"
      required
    >

    <label for="password" class="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Password:
    </label>
    <input
      v-model="password"
      class="w-full p-2 mt-2 mb-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      type="password"
      name="password"
      minlength="6"
      placeholder="New password"
      autocomplete="new-password"
      required
    >

    <p id="password-strength" class="mb-4 text-gray-600 dark:text-gray-400">
      Password strength: <span class="font-semibold text-gray-700 dark:text-gray-100">{{ passwordStrength.title }}</span>
    </p>

    <label for="password-confirm" class="block text-lg font-medium text-gray-700 dark:text-gray-300">
      Confirm password:
    </label>
    <input
      id="password-confirm"
      v-model="confirmPassword"
      class="w-full p-2 mt-2 mb-4 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
      type="password"
      name="password-confirm"
      placeholder="Confirm password"
      autocomplete="off"
      required
    >
    <p v-if="passwordsMatch" :class="['mb-4', passwordsMatch.classList]">
      {{ passwordsMatch.feedback }}
    </p>

    <input
      type="submit"
      value="Sign up"
      class="fancy-button w-full"
      :disabled="!isAllowedToSubmit()"
    >

    <p
      v-if="loginStateMessage" :class="{
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
</template>
