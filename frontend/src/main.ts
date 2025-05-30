import '@/assets/styles/index.css';
import { createApp } from 'vue';
import Application from '@/Application.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import { availableLocales, chooseAvailableLocale } from '@/scripts/translation';
import { createI18n } from 'vue-i18n';

const locale = chooseAvailableLocale();
const i18n = createI18n({
  warnHtmlInMessage: false,
  legacy: false,
  locale,
  fallbackLocale: 'en',
  availableLocales: availableLocales.map((locale) => locale[0]),
  messages: {
    en: {},
    hr: {},
    it: {},
  },
});

createApp(Application).use(router).use(createPinia()).use(i18n).mount('#app');
