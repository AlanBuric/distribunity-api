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
    en: {
      home: 'Home',
      blog: 'Blog',
      resources: 'Resources',
      logIn: 'Log in',
      signUp: 'Sign Up',
      homeTitle2: 'Coming soon to your Desktop and Mobile platforms!',
      homePar2:
        "We're planning to port Distribunity as a standalone installed application for your devices.",
      homeBtn2: 'Notify me when it happens',
      previous: 'Previous',
      backToTop: 'Back to top',
      next: 'Next',
    },
    hr: {
      home: 'Početna',
      blog: 'Blog',
      resources: 'Informacije',
      logIn: 'Prijava',
      signUp: 'Novi račun',
      homeTitle2: 'Uskoro stiže na vaša računala i pametne telefone!',
      homePar2:
        'Planiramo razviti Distribunity kao zasebnu instaliranu aplikaciju za vaše uređaje.',
      homeBtn2: 'Obavijestite me o tome',
      previous: 'Prijašnja',
      backToTop: 'Vrati me na vrh',
      next: 'Slijedeća',
    },
    it: {},
  },
});

application.use(i18n).mount('#app');
