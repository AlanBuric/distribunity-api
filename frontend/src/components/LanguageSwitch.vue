<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { availableLanguages } from '@/store/global.ts';
  import TranslationIcon from './icons/TranslationIcon.vue';
  import { LocalStorage, type LanguageTag } from '@/types';
  import { i18n } from '@/main';

  const { t } = useI18n();
  const isDropdownOpen = ref(false);

  function onClickOutside(event: MouseEvent) {
    isDropdownOpen.value = !!(event.target as HTMLElement).closest('.lang-dropdown');
  }

  function onLanguageClick(language: LanguageTag) {
    i18n.global.locale.value = language;
    isDropdownOpen.value = false;
  }

  watch(isDropdownOpen, (val) => {
    if (val) window.addEventListener('click', onClickOutside);
    else window.removeEventListener('click', onClickOutside);
  });

  watch(i18n.global.locale, (current) => localStorage.setItem(LocalStorage.LOCALE, current));
</script>

<template>
  <div class="relative lang-dropdown inline-block">
    <button
      class="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      @click.stop="isDropdownOpen = !isDropdownOpen"
      :title="t('switchLanguage')"
      aria-haspopup="listbox"
      :aria-expanded="isDropdownOpen"
    >
      <TranslationIcon class="w-5 h-5 fill-slate-700 dark:fill-slate-300" />
    </button>
    <ul
      v-if="isDropdownOpen"
      class="absolute right-0 mt-2 min-w-[8rem] bg-white dark:bg-slate-800 shadow-lg rounded-xl z-40 border border-slate-200 dark:border-slate-700"
      role="listbox"
    >
      <li
        v-for="[language, name] in availableLanguages"
        :key="language"
        class="px-4 py-2 first:rounded-t-xl last:rounded-b-xl cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        :aria-selected="i18n.global.locale.value == language"
        @click="onLanguageClick(language)"
        tabindex="0"
        role="option"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<i18n>
{
  "en-US": {
    "switchLanguage": "Select display language"
  },
  "hr-HR": {
    "switchLanguage": "Odaberi jezik prikaza"
  },
  "it-IT": {
    "switchLanguage": "Seleziona la lingua di visualizzazione"
  }
}
</i18n>
