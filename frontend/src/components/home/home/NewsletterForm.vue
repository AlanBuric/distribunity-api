<script lang="ts" setup>
  import { database } from '@/firebase/init';
  import { doc, setDoc } from 'firebase/firestore';
  import { ref } from 'vue';

  const submitted = ref(false);
  const email = ref();

  function signupForNewsLetter() {
    setDoc(doc(database, 'email-subscriptions', email.value), {})
      .then(() => submitted.value = true)
      .catch(error => console.error(error));
    submitted.value = true;
  }
</script>

<template>
  <section class="flex flex-col items-center p-6">
    <h2 v-if="submitted" class="text-2xl font-semibold text-green-500 dark:text-green-400">
      Thank you for subscribing to our newsletter!
    </h2>
    <template v-else>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Sign up for our newsletter
        </h2>
        <p class="text-lg text-gray-700 dark:text-gray-300">
          Subscribe to our journey on becoming a favored choice for businesses.
        </p>
      </div>
      <form @submit.prevent="signupForNewsLetter" class="w-full max-w-md">
        <div class="mb-4">
          <input
            v-model="email"
            class="custom-input w-full p-3 border text-gray-700 dark:text-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-teal-400"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="Your e-mail"
            required
          >
        </div>
        <div class="mb-4 flex items-center">
          <input
            type="checkbox"
            id="agreement"
            name="agreement"
            class="form-checkbox h-5 w-5 text-teal-500 dark:text-teal-400"
            required
          >
          <label
            for="agreement"
            class="ml-3 text-gray-700 dark:text-gray-300 text-sm"
          >
            I allow Distribunity to save my e-mail for sending me promotions and educational content,
            and have the right to cancel my subscription any time.
          </label>
        </div>
        <div class="space-x-3">
          <button
            type="submit"
            class="text-lg fancy-button"
          >
            Subscribe
          </button>
          <slot />
        </div>
      </form>
    </template>
  </section>
</template>
