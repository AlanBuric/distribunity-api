<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { availableLanguages } from '@/store/global.ts';
  import TranslationIcon from './icons/TranslationIcon.vue';
  import { LocalStorage } from '@/types';

  const { locale } = useI18n();
  const open = ref(false);

  function onClickOutside(event: MouseEvent) {
    open.value = !!(event.target as HTMLElement).closest('.lang-dropdown');
  }

  watch(open, (val) => {
    if (val) window.addEventListener('click', onClickOutside);
    else window.removeEventListener('click', onClickOutside);
  });

  watch(locale, (current) => localStorage.setItem(LocalStorage.LOCALE, current));
</script>

<template>
  <div class="relative lang-dropdown inline-block">
    <button
      class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      @click.stop="open = !open"
      title="Select language"
      aria-haspopup="listbox"
      :aria-expanded="open"
    >
      <TranslationIcon class="w-5 h-5 fill-gray-700 dark:fill-gray-300" />
    </button>
    <ul
      v-if="open"
      class="absolute right-0 mt-2 min-w-[8rem] bg-white dark:bg-gray-800 shadow-lg rounded-xl z-40 border border-gray-200 dark:border-gray-700"
      role="listbox"
    >
      <li
        v-for="[value, name] in availableLanguages"
        :key="value"
        class="px-4 py-2 first:rounded-t-xl last:rounded-b-xl cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        :aria-selected="locale === value"
        @click="
          locale = value;
          open = false;
        "
        tabindex="0"
        role="option"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>
