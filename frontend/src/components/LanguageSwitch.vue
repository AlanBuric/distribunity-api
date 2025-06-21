<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { availableLanguages } from '@/store/global.ts';
  import { watch } from 'vue';

  const { locale } = useI18n();

  watch(locale, (current) => localStorage.setItem('language', current));
</script>

<template>
  <select
    class="bg-transparent text-lg font-medium text-gray-700 dark:text-gray-300 rounded-xl"
    title="Select the display language"
    v-model="locale"
  >
    <option
      v-for="[value, name] in availableLanguages"
      :value="value"
      :key="value"
      class="dark:bg-gray-800 border-0"
    >
      {{ name }}
    </option>
  </select>
</template>
