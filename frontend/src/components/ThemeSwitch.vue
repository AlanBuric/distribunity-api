<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import MoonIcon from './icons/MoonIcon.vue';
  import SunIcon from './icons/SunIcon.vue';
  import useGlobalStore from '@/store/global';

  const store = useGlobalStore();
  const { t } = useI18n();
</script>

<template>
  <button
    @click="store.nextTheme"
    class="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1"
    :title="t('switchTheme')"
  >
    <MoonIcon v-if="store.theme == 'dark'" class="w-5 h-5 fill-slate-300" />
    <SunIcon v-else class="w-5 h-5 fill-slate-800" />
  </button>
</template>

<i18n>
{
  "en-US": {
    "switchTheme": "Switch display theme"
  },
  "hr-HR": {
    "switchTheme": "Promijeni temu prikaza"
  },
  "it-IT": {
    "switchTheme": "Cambia tema di visualizzazione"
  }
}
</i18n>
