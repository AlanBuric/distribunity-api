import '@/assets/styles/index.css';
import { createApp } from 'vue';
import Application from '@/Application.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import useGlobalStore, { availableLanguages } from './store/global';
import messages from './store/translations';
import type { LanguageTag } from './types';

const pinia = createPinia();

const application = createApp(Application).use(router).use(pinia);

useGlobalStore().loadPreferredLanguage();

export const i18n = createI18n({
  legacy: false,
  //warnHtmlInMessage: false,
  locale: useGlobalStore().language,
  fallbackLocale: 'en-US' satisfies LanguageTag,
  availableLocales: availableLanguages.map(([tag]) => tag),
  messages,
});

application.use(i18n).mount('#app');
