import '@/assets/styles/index.css';
import { createApp } from 'vue';
import Application from '@/Application.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import useGlobalStore, { availableLanguages } from './store/global';

const application = createApp(Application).use(router).use(createPinia());

useGlobalStore().loadPreferredLanguage();

const i18n = createI18n({
  warnHtmlInMessage: false,
  legacy: false,
  locale: useGlobalStore().language,
  fallbackLocale: 'en-US',
  availableLocales: availableLanguages.map(([tag]) => tag),
  messages: {
    en: {},
    hr: {},
    it: {},
  },
});

application.use(i18n).mount('#app');
