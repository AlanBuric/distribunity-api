<script setup lang="ts">
  import ModalPopup from '@/components/ModalPopup.vue';
  import { ref } from 'vue';
  import NewsletterForm from './NewsletterForm.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const showNewsletterForm = ref(false);
</script>

<template>
  <section class="flex p-5 flex-1">
    <ModalPopup v-if="showNewsletterForm">
      <NewsletterForm>
        <button
          @click.prevent="showNewsletterForm = false"
          class="px-4 py-2 font-medium bg-slate-100 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600 focus:outline-none"
        >
          Close
        </button>
      </NewsletterForm>
    </ModalPopup>
    <div class="">
      <h2 class="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        {{ t('comingSoonTitle') }}
      </h2>
      <p class="text-lg text-slate-700 dark:text-slate-300 mb-4">
        {{ t('comingSoonDescription') }}
      </p>
      <button
        class="text-lg button-primary"
        title="Sign up for our newsletter"
        @click="showNewsletterForm = !showNewsletterForm"
      >
        {{ t('notifyMe') }}
      </button>
    </div>
  </section>
</template>

<i18n>
{
  "en-US": {
    "comingSoonTitle": "Coming soon to your Desktop and Mobile platforms!",
    "comingSoonDescription": "We're planning to port Distribunity as a standalone installed application for your devices.",
    "notifyMe": "Notify me when it happens"
  },
  "hr-HR": {
    "comingSoonTitle": "Uskoro na vašim desktop i mobilnim platformama!",
    "comingSoonDescription": "Planiramo razviti Distribunity kao samostalnu aplikaciju za vaše uređaje.",
    "notifyMe": "Obavijesti me kad bude dostupno"
  },
  "it-IT": {
    "comingSoonTitle": "Presto disponibile su Desktop e Mobile!",
    "comingSoonDescription": "Abbiamo in programma di portare Distribunity come applicazione installabile per i tuoi dispositivi.",
    "notifyMe": "Avvisami quando sarà disponibile"
  }
}
</i18n>
