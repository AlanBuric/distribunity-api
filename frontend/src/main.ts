import '@/assets/styles/index.css';
import { createApp } from 'vue';
import Application from '@/Application.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import useGlobalStore, { availableLanguages } from './store/global';
import { pickRandom } from './scripts/shared';

const application = createApp(Application).use(router).use(createPinia());

useGlobalStore().loadPreferredLanguage();

const i18n = createI18n({
  warnHtmlInMessage: false,
  legacy: false,
  locale: useGlobalStore().language,
  fallbackLocale: 'en-US',
  availableLocales: availableLanguages.map(([tag]) => tag),
  messages: {
    'en-US': {
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
      homeIntroTitle: () =>
        pickRandom([
          "It's time to ditch the spreadsheets and pen & paper.",
          'Ditch the chaos. Master your inventory.',
        ]),
      homeIntroDescription: () =>
        pickRandom([
          'Distribunity takes care of all the inventory changes, details and item tracking of your business in one place.',
          'Stop losing track of stock with scattered spreadsheets. Distribunity centralizes your entire inventory operation—from receiving to shipping—in one intelligent platform.',
        ]),
      homeSignUp: () =>
        pickRandom([
          'Sign up for free',
          'See it in action',
          'Get organized today',
          'Start your free trial',
        ]),
    },
    'hr-HR': {
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
      homeIntroTitle: () =>
        pickRandom(['Vrijeme je da se riješite proračunskih tablica i papira.']),
      homeIntroDescription: () =>
        pickRandom([
          'Distribunity se brine za sve promjene u skladištu, detaljima i praćenju robe.',
        ]),
      homeSignUp: () => pickRandom(['Prijavite se besplatno']),
    },
    'it-IT': {
      homeIntroTitle: () => pickRandom(['È ora di abbandonare i fogli di calcolo e la carta.']),
      homeIntroDescription: () =>
        pickRandom([
          "Distribunity si occupa di tutte le modifiche all'inventario, dei dettagli e del monitoraggio degli articoli della tua attività in un unico posto.",
        ]),
      homeSignUp: () => pickRandom(['Iscriviti gratis']),
    },
  },
});

application.use(i18n).mount('#app');
