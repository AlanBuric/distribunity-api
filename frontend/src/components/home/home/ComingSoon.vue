<script setup lang="ts">
  import ModalPopup from '@/components/ModalPopup.vue';
  import { ref } from 'vue';
  import NewsletterForm from './NewsletterForm.vue';

  const showNewsletterForm = ref(false);
</script>

<template>
  <section class="flex flex-col-reverse md:flex-row items-center justify-evenly p-5">
    <ModalPopup v-if="showNewsletterForm">
      <NewsletterForm>
        <button @click.prevent="showNewsletterForm = false" class="px-6 py-3 font-medium bg-gray-100 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none">
          Close
        </button>
      </NewsletterForm>
    </ModalPopup>
    <img
      src="@/assets/phone-example.png"
      alt="Phone Example"
      class="h-[30em] max-md:hidden"
    >
    <div class="text-center lg:text-left">
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Coming soon to your Desktop and Mobile platforms!
      </h2>
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
        We're planning to port Distribunity as a standalone installed application for your devices.
      </p>
      <button
        class="text-lg fancy-button"
        title="Sign up for our newsletter"
        @click="showNewsletterForm = !showNewsletterForm"
      >
        Notify me when it happens
      </button>
    </div>
  </section>
</template>
